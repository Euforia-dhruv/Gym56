/**
 * Makes a user admin by email.
 * Usage: node scripts/make-admin.mjs your@email.com
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");

const env = Object.fromEntries(
  readFileSync(envPath, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/make-admin.mjs <email>");
  process.exit(1);
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Find user by email
const { data: users, error: listError } = await supabase.auth.admin.listUsers();
if (listError) { console.error("List users failed:", listError); process.exit(1); }

const user = users.users.find((u) => u.email === email);
if (!user) { console.error(`No user found with email "${email}". Sign up first via /login`); process.exit(1); }

// Upsert profile with admin role
const { error } = await supabase.from("profiles").upsert(
  { id: user.id, role: "admin", full_name: user.email?.split("@")[0] || "Admin", updated_at: new Date().toISOString() },
  { onConflict: "id" }
);

if (error) {
  // Try insert if upsert fails (table might exist but RLS blocks)
  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    role: "admin",
    full_name: user.email?.split("@")[0] || "Admin",
  });
  if (insertError) { console.error("Failed:", insertError); process.exit(1); }
}

console.log(`✅ User "${email}" (${user.id}) is now admin. Sign out and back in at /login`);
