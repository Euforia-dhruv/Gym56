"use client";

import * as React from "react";
import { Save, MapPin, Phone, Mail, Clock, Globe, Link } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

// ─── Section wrapper ─────────────────────────────────────────────────────────

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="lg:col-span-2 rounded-2xl bg-[#111] border border-white/8 p-6 space-y-5">
        {children}
      </div>
    </section>
  );
}

// ─── Opening hours ────────────────────────────────────────────────────────────

type DayHours = { open: string; close: string; closed: boolean };
type WeekHours = Record<string, DayHours>;

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultHours: WeekHours = Object.fromEntries(
  DAYS.map((day) => [
    day,
    {
      open: day === "Sunday" ? "" : "06:00",
      close: day === "Sunday" ? "" : "22:00",
      closed: day === "Sunday",
    },
  ])
);

function OpeningHoursEditor({
  hours,
  onChange,
}: {
  hours: WeekHours;
  onChange: (hours: WeekHours) => void;
}) {
  return (
    <div className="space-y-3">
      {DAYS.map((day) => {
        const h = hours[day];
        return (
          <div
            key={day}
            className="flex items-center gap-3 flex-wrap sm:flex-nowrap"
          >
            <div className="flex items-center gap-2 w-28 flex-shrink-0">
              <input
                type="checkbox"
                id={`closed-${day}`}
                checked={!h.closed}
                onChange={(e) =>
                  onChange({
                    ...hours,
                    [day]: { ...h, closed: !e.target.checked },
                  })
                }
                className="w-4 h-4 accent-accent rounded"
                aria-label={`${day} open`}
              />
              <label
                htmlFor={`closed-${day}`}
                className="text-sm text-gray-300 select-none"
              >
                {day.slice(0, 3)}
              </label>
            </div>
            {h.closed ? (
              <span className="text-sm text-gray-600 italic">Closed</span>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={h.open}
                  onChange={(e) =>
                    onChange({
                      ...hours,
                      [day]: { ...h, open: e.target.value },
                    })
                  }
                  className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent"
                  aria-label={`${day} opening time`}
                />
                <span className="text-gray-600 text-sm">to</span>
                <input
                  type="time"
                  value={h.close}
                  onChange={(e) =>
                    onChange({
                      ...hours,
                      [day]: { ...h, close: e.target.value },
                    })
                  }
                  className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent"
                  aria-label={`${day} closing time`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  // Gym info
  const [gymName, setGymName] = React.useState("Gym 56");
  const [tagline, setTagline] = React.useState(
    "Premium Fitness Experience in Gandhinagar"
  );
  const [address, setAddress] = React.useState(
    "Sector 26, Gandhinagar, Gujarat 382026"
  );
  const [phone, setPhone] = React.useState("+91 98765 43210");
  const [email, setEmail] = React.useState("info@gym56.com");
  const [website, setWebsite] = React.useState("https://gym56.vercel.app");

  // Social links
  const [instagram, setInstagram] = React.useState("");
  const [facebook, setFacebook] = React.useState("");
  const [youtube, setYoutube] = React.useState("");
  const [googleMaps, setGoogleMaps] = React.useState(
    "https://www.google.com/maps"
  );

  // Opening hours
  const [hours, setHours] = React.useState<WeekHours>(defaultHours);

  const handleSave = async (section: string) => {
    setSaving(true);
    // Simulated save delay — replace with Server Action in Sprint 2A
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast({
      title: `${section} saved`,
      description: "Your changes have been saved successfully.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-10">
      <PageHeader
        title="Settings"
        description="Manage gym information, contact details, and operational settings."
      />

      {/* Divider */}
      <div className="border-t border-white/8" />

      {/* Gym information */}
      <SettingsSection
        title="Gym Information"
        description="Basic details about your gym shown on the public website."
      >
        <Input
          label="Gym Name"
          value={gymName}
          onChange={(e) => setGymName(e.target.value)}
          placeholder="Gym 56"
        />
        <Input
          label="Tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Premium Fitness Experience in Gandhinagar"
        />
        <Input
          label="Website URL"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          leftIcon={<Globe className="w-4 h-4" />}
          placeholder="https://gym56.vercel.app"
          type="url"
        />
        <div className="flex justify-end pt-2">
          <Button
            size="sm"
            loading={saving}
            onClick={() => handleSave("Gym Information")}
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            Save Changes
          </Button>
        </div>
      </SettingsSection>

      <div className="border-t border-white/8" />

      {/* Contact details */}
      <SettingsSection
        title="Contact Details"
        description="Contact information displayed in the footer and contact page."
      >
        <Input
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          leftIcon={<MapPin className="w-4 h-4" />}
          placeholder="Sector 26, Gandhinagar, Gujarat"
        />
        <Input
          label="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          leftIcon={<Phone className="w-4 h-4" />}
          placeholder="+91 98765 43210"
          type="tel"
        />
        <Input
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          placeholder="info@gym56.com"
          type="email"
        />
        <div className="flex justify-end pt-2">
          <Button
            size="sm"
            loading={saving}
            onClick={() => handleSave("Contact Details")}
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            Save Changes
          </Button>
        </div>
      </SettingsSection>

      <div className="border-t border-white/8" />

      {/* Social links */}
      <SettingsSection
        title="Social Links"
        description="Links to your gym's social media profiles and Google Maps listing."
      >
        <Input
          label="Instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          leftIcon={<Link className="w-4 h-4" />}
          placeholder="https://instagram.com/gym56"
          type="url"
        />
        <Input
          label="Facebook"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          leftIcon={<Link className="w-4 h-4" />}
          placeholder="https://facebook.com/gym56"
          type="url"
        />
        <Input
          label="YouTube"
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          leftIcon={<Link className="w-4 h-4" />}
          placeholder="https://youtube.com/@gym56"
          type="url"
        />
        <Input
          label="Google Maps / Reviews Link"
          value={googleMaps}
          onChange={(e) => setGoogleMaps(e.target.value)}
          leftIcon={<MapPin className="w-4 h-4" />}
          placeholder="https://maps.google.com/..."
          type="url"
          hint='Replaces the placeholder "https://www.google.com" link in TrustedSection'
        />
        <div className="flex justify-end pt-2">
          <Button
            size="sm"
            loading={saving}
            onClick={() => handleSave("Social Links")}
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            Save Changes
          </Button>
        </div>
      </SettingsSection>

      <div className="border-t border-white/8" />

      {/* Opening hours */}
      <SettingsSection
        title="Opening Hours"
        description="Set the days and hours your gym is open. Shown on the About and Contact pages."
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-accent" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-300">
            Weekly Schedule
          </span>
        </div>
        <OpeningHoursEditor hours={hours} onChange={setHours} />
        <div className="flex justify-end pt-4">
          <Button
            size="sm"
            loading={saving}
            onClick={() => handleSave("Opening Hours")}
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            Save Hours
          </Button>
        </div>
      </SettingsSection>

      <div className="border-t border-white/8" />

      {/* Danger zone */}
      <SettingsSection
        title="Danger Zone"
        description="Irreversible actions. Proceed with extreme caution."
      >
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <div>
            <p className="text-sm font-semibold text-white">
              Clear all mock data
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Remove all placeholder data when connected to Supabase. Sprint 2A
              action.
            </p>
          </div>
          <Button size="sm" variant="danger" disabled>
            Coming in 2A
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
}
