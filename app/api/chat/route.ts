import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const GYM_INFO = {
  name: "GYM 56",
  location: "Sector 26, Gandhinagar, Gujarat, India",
  hours: "Mon-Sat: 6-10 AM & 5-10 PM, Sun: Closed",
  phone: "+91 99244 41179",
  programs: ["Strength Training", "Weight Loss", "Personal Training"],
  equipment: [
    "Cable crossover", "Lat pulldown", "Leg press", "Power rack",
    "Treadmills", "Spin bikes", "Dumbbells", "Barbells",
    "EZ curl bar", "Leg extension/curl machine", "Pec deck",
    "Adjustable benches",
  ],
};

const CATEGORY_INFO: Record<string, string> = {
  chest: "Chest exercises target your pectoral muscles. Compound movements like bench press are most effective.",
  back: "Back exercises target your lats, traps, and rhomboids. Focus on pulling movements like rows and pull-ups.",
  shoulders: "Shoulder exercises target your deltoids. Use overhead press and lateral raises for balanced development.",
  legs: "Leg exercises target quads, hamstrings, and calves. Squats and deadlifts are foundational.",
  arms: "Arm exercises target biceps and triceps. Combine curls and press-downs for balanced arm development.",
  core: "Core exercises target your abdominals and lower back. Planks and dead bugs build stability.",
  cardio: "Cardio exercises improve cardiovascular health and endurance. Mix steady-state and HIIT for best results.",
  glutes: "Glute exercises target your gluteal muscles. Hip thrusts and Romanian deadlifts are excellent choices.",
  obliques: "Oblique exercises target your side abdominals. Russian twists and side planks are effective.",
  abs: "Ab exercises target your rectus abdominis. Crunches and leg raises build definition.",
};

const TOP_QUERIES = [
  { keywords: ["workout plan", "routine", "split", "push pull", "ppl", "bro split", "schedule"], intent: "workout_plan" },
  { keywords: ["beginner", "new to gym", "start", "first time", "newbie", "starting"], intent: "beginner" },
  { keywords: ["weight loss", "fat loss", "lose weight", "cut", "shred", "burn fat"], intent: "weight_loss" },
  { keywords: ["muscle gain", "build muscle", "bulk", "hypertrophy", "grow", "size"], intent: "muscle_gain" },
  { keywords: ["nutrition", "diet", "protein", "calories", "pre workout", "post workout", "meal", "eat", "supplement", "creatine", "whey"], intent: "nutrition" },
  { keywords: ["form", "technique", "how to", "proper", "correct", "mistake"], intent: "exercise_form" },
  { keywords: ["recovery", "rest", "sore", "warm up", "cool down", "stretch", "mobility", "injury"], intent: "recovery" },
  { keywords: ["equipment", "machine", "cable", "dumbbell", "barbell", "free weight"], intent: "equipment" },
  { keywords: ["phone", "call", "contact", "address", "location", "timing", "hour", "open"], intent: "gym_info" },
  { keywords: ["sign up", "join", "register", "fee", "cost", "price"], intent: "pricing" },
];

function detectIntent(text: string): string | null {
  const lower = text.toLowerCase();
  for (const query of TOP_QUERIES) {
    if (query.keywords.some((kw) => lower.includes(kw))) {
      return query.intent;
    }
  }
  if (lower.split(/\s+/).length <= 5) return "quick_search";
  return null;
}

type SupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

async function searchExercises(supabase: SupabaseClient, query: string, limit = 5) {
  const q = query.toLowerCase();
  const { data } = await supabase
    .from("exercises")
    .select("name, slug, category, difficulty, target_muscles, common_mistakes, safety_tips, breathing, primary_image_url, instructions, equipment_label")
    .eq("is_published", true)
    .is("deleted_at", null)
    .or(
      `name.ilike.%${q}%,target_muscles.cs.{${q}},category.ilike.%${q}%`
    )
    .limit(limit);
  return data || [];
}

function formatExerciseResponse(exercises: Record<string, unknown>[]): string {
  if (exercises.length === 0) return "";
  let text = `\n\nHere are some relevant exercises:\n`;
  exercises.forEach((ex, i) => {
    const name = ex.name as string;
    const category = ex.category as string;
    const difficulty = ex.difficulty as string;
    const targetMuscles = ex.target_muscles as string[] | undefined;
    const equipmentLabel = ex.equipment_label as string | undefined;
    const breathing = ex.breathing as string | undefined;
    const commonMistakes = ex.common_mistakes as string[] | undefined;

    text += `\n${i + 1}. **${name}** — ${category} (${difficulty})`;
    if (targetMuscles?.length) {
      text += `\n   Muscles: ${targetMuscles.join(", ")}`;
    }
    if (equipmentLabel) {
      text += `\n   Equipment: ${equipmentLabel}`;
    }
    if (breathing) {
      text += `\n   Breathing: ${breathing}`;
    }
    if (commonMistakes?.length) {
      text += `\n   Common mistakes: ${commonMistakes.slice(0, 2).join("; ")}`;
    }
  });
  return text;
}

async function handleTextQuery(supabase: SupabaseClient, text: string): Promise<string> {
  const intent = detectIntent(text);
  const lower = text.toLowerCase();

  // Single short query — treat as exercise search
  if (intent === "quick_search") {
    const exercises = await searchExercises(supabase, text, 3);
    if (exercises.length > 0) {
      return `I found some exercises matching "${text}":${formatExerciseResponse(exercises)}`;
    }
  }

  // Specific exercise name
  const { data: exactExercise } = await supabase
    .from("exercises")
    .select("name, category, difficulty, target_muscles, secondary_muscles, common_mistakes, safety_tips, breathing, beginner_tips, variations, alternatives, progressions, regressions, equipment_label")
    .eq("is_published", true)
    .is("deleted_at", null)
    .ilike("name", `%${text}%`)
    .limit(1);

  if (exactExercise && exactExercise.length > 0) {
    const ex = exactExercise[0];
    let response = `**${ex.name}** — ${ex.category} (${ex.difficulty})\n\n`;
    if (ex.target_muscles?.length) response += `**Target muscles:** ${ex.target_muscles.join(", ")}\n`;
    if (ex.secondary_muscles?.length) response += `**Secondary muscles:** ${ex.secondary_muscles.join(", ")}\n`;
    if (ex.equipment_label) response += `**Equipment needed:** ${ex.equipment_label}\n`;
    if (ex.breathing) response += `**Breathing:** ${ex.breathing}\n\n`;
    if (ex.beginner_tips?.length) response += `**Tips:** ${ex.beginner_tips.slice(0, 2).join(" ")}\n`;
    if (ex.common_mistakes?.length) response += `\n**Common mistakes to avoid:** ${ex.common_mistakes.slice(0, 3).join("; ")}\n`;
    if (ex.safety_tips?.length) response += `**Safety:** ${ex.safety_tips.slice(0, 2).join(" ")}\n`;
    return response;
  }

  // Intent-based responses
  let category = Object.entries(CATEGORY_INFO).find(([key]) => lower.includes(key))?.[0];

  switch (intent) {
    case "workout_plan": {
      const cat = category || "full body";
      const exercises = await searchExercises(supabase, cat, 4);
      let response = `Here's a workout plan targeting **${cat}**:\n\n`;
      if (lower.includes("push") || lower.includes("pull") || lower.includes("legs")) {
        response = `Here's a **Push/Pull/Legs (PPL) split**:\n\n**Push Day** — Chest, Shoulders, Triceps\n**Pull Day** — Back, Biceps\n**Leg Day** — Quads, Hamstrings, Glutes\n\nTrain 6 days a week (Push/Pull/Legs x2) with rest on Sunday.\n`;
      } else if (lower.includes("upper") || lower.includes("lower")) {
        response = `Here's an **Upper/Lower split**:\n\n**Upper Day** — Push + Pull exercises for upper body\n**Lower Day** — Squat + Deadlift variations for legs\n\nTrain 4 days a week.\n`;
      } else {
        response = `Here's a beginner-friendly **full body routine** (3x/week):\n\n`;
      }
      response += formatExerciseResponse(exercises);
      response += `\n\nGYM 56 hours: ${GYM_INFO.hours}`;
      return response;
    }

    case "beginner": {
      const exercises = await searchExercises(supabase, "beginner", 5);
      let response = `Welcome to GYM 56! Here's your starter guide:\n\n` +
        `1. **Start slow** — 3 full-body workouts per week with rest days in between\n` +
        `2. **Focus on form** — Master the movement before adding weight\n` +
        `3. **Stay consistent** — Progress is built one session at a time\n`;
      if (exercises.length > 0) {
        response += `\nGreat beginner-friendly exercises available at our gym:${formatExerciseResponse(exercises)}`;
      }
      response += `\n\nNeed help with any specific exercise form? Just ask!`;
      return response;
    }

    case "weight_loss": {
      const response = `**Weight Loss Program at GYM 56**:\n\n` +
        `1. **Cardio** — 30-45 min of moderate cardio (treadmill, spin bike) 4-5x/week\n` +
        `2. **Strength training** — Compound lifts burn more calories. 3-4x/week.\n` +
        `3. **HIIT** — 20 min high-intensity intervals, 2-3x/week for maximum fat burn\n` +
        `4. **Nutrition** — Slight calorie deficit (300-500 cal), high protein (1.6-2.2g/kg bodyweight)\n\n` +
        `Consistency beats intensity. GYM 56 is open ${GYM_INFO.hours.toLowerCase()} for your workouts!`;
      return response;
    }

    case "muscle_gain": {
      const response = `**Muscle Building at GYM 56**:\n\n` +
        `1. **Progressive overload** — Gradually increase weight/reps each week\n` +
        `2. **Compound lifts** — Squat, Deadlift, Bench Press, Overhead Press, Rows\n` +
        `3. **Rep range** — 6-12 reps for hypertrophy, 3-5 sets per exercise\n` +
        `4. **Frequency** — Train each muscle group 2x/week\n` +
        `5. **Calorie surplus** — Eat 200-400 calories above maintenance\n` +
        `6. **Protein** — 1.6-2.2g per kg of bodyweight daily\n\n` +
        `GYM 56 has all the equipment you need — power racks, dumbbells up to 50kg, cable machines, and more!`;
      return response;
    }

    case "nutrition": {
      let response = `**Nutrition Tips**:\n\n`;
      if (lower.includes("pre workout") || lower.includes("pre-workout") || lower.includes("before")) {
        response += `**Pre-workout (1-2 hours before):**\n- Complex carbs (oatmeal, banana, whole grain toast)\n- Moderate protein\n- Low fat (slows digestion)\n- Stay hydrated\n\n**Example:** Banana + peanut butter toast or oatmeal with whey protein\n`;
      } else if (lower.includes("post workout") || lower.includes("post-workout") || lower.includes("after")) {
        response += `**Post-workout (within 30-60 min):**\n- Fast-digesting protein (whey, chicken, eggs)\n- Simple carbs (rice, potato, fruit)\n- Replenish electrolytes\n\n**Example:** Whey protein shake + banana + rice/chicken\n`;
      } else if (lower.includes("creatine")) {
        response += `**Creatine:** 3-5g daily. No need to cycle or load. Take any time — consistency matters most. One of the most researched, safe, and effective supplements.\n`;
      } else if (lower.includes("protein")) {
        response += `**Protein needs:** 1.6-2.2g per kg bodyweight daily.\n- Whey protein: Fast absorption, great post-workout\n- Casein: Slow absorption, good before bed\n- Plant options: Soy, pea, hemp protein\n- Real food: Chicken, eggs, fish, paneer, lentils, Greek yogurt\n`;
      } else {
        response += `**General guidelines:**\n- Prioritize whole foods (lean proteins, complex carbs, healthy fats, vegetables)\n- Stay hydrated — 3-4L water daily\n- Pre-workout: Carbs + protein 1-2 hours before\n- Post-workout: Protein + carbs within 30-60 min\n- Limit processed foods and added sugars`;
      }
      return response;
    }

    case "exercise_form": {
      category = category || "squat";
      const exercises = await searchExercises(supabase, category, 2);
      let response = `**Form Tips**:\n\n`;
      if (exercises.length > 0) {
        response = `Let me help you with proper technique:${formatExerciseResponse(exercises)}`;
      } else {
        response += `**General form principles:**\n` +
          `1. **Neutral spine** — Keep your back straight, not rounded\n` +
          `2. **Bracing** — Tighten your core before each rep\n` +
          `3. **Full ROM** — Use complete range of motion when possible\n` +
          `4. **Control** — Lower slowly (2-3 sec), explode up\n` +
          `5. **Breathing** — Exhale on exertion, inhale on lowering\n\n` +
          `Tip: Record yourself and compare with reference videos.`;
      }
      return response;
    }

    case "recovery": {
      return `**Recovery & Injury Prevention**:\n\n` +
        `**Warm-up (5-10 min before workout):**\n- Light cardio (jump rope, jogging)\n- Dynamic stretches (leg swings, arm circles)\n- Movement prep (bodyweight squats, band pull-aparts)\n\n` +
        `**Cool-down (5-10 min after):**\n- Static stretches (hold 20-30 sec)\n- Foam rolling tight areas\n\n` +
        `**Rest days:**\n- Take 1-2 rest days per week\n- Sleep 7-9 hours for optimal recovery\n- Active recovery: Light walking, stretching, mobility work\n\n` +
        `**Important:** If something hurts (not just sore), stop and rest. Consult a doctor for persistent pain.`;
    }

    case "equipment": {
      const { data: equip } = await supabase
        .from("equipment")
        .select("name, category, description, muscles_trained, difficulty, location, is_available")
        .eq("is_published", true)
        .is("deleted_at", null)
        .limit(8);

      let response = `**GYM 56 Equipment & Machines**:\n\n`;
      if (equip && equip.length > 0) {
        const available = equip.filter((e: { is_available: boolean }) => e.is_available);
        available.forEach((e: Record<string, unknown>) => {
          response += `- **${e.name}** (${e.category}, ${e.difficulty})`;
          if (e.location) response += ` — ${e.location}`;
          if ((e.muscles_trained as string[] | undefined)?.length) response += ` — Targets: ${(e.muscles_trained as string[]).slice(0, 3).join(", ")}`;
          response += "\n";
        });
        response += `\nAll equipment is located at GYM 56 in Sector 26, Gandhinagar.`;
      } else {
        response += GYM_INFO.equipment.map((e) => `- ${e}`).join("\n");
      }
      return response;
    }

    case "gym_info": {
      return `**${GYM_INFO.name}**\n` +
        `📍 ${GYM_INFO.location}\n` +
        `📞 ${GYM_INFO.phone}\n` +
        `🕐 ${GYM_INFO.hours}\n\n` +
        `**Programs offered:** ${GYM_INFO.programs.join(", ")}\n\n` +
        `Our facility features: ${GYM_INFO.equipment.slice(0, 6).join(", ")}, and more!`;
    }

    case "pricing": {
      return `For inquiries about fees and joining GYM 56, please **contact us**:\n` +
        `📞 ${GYM_INFO.phone}\n` +
        `💬 WhatsApp: https://wa.me/91992441179\n` +
        `📍 Visit us at ${GYM_INFO.location}\n\n` +
        `We'd love to have you train with us!`;
    }
  }

  // Category-specific info
  if (category) {
    const exercises = await searchExercises(supabase, category, 4);
    let response = CATEGORY_INFO[category] + "\n";
    response += formatExerciseResponse(exercises);
    return response;
  }

  // General fallback — search everything
  const exercises = await searchExercises(supabase, text, 4);
  if (exercises.length > 0) {
    return `I found exercises related to "${text}" in our database:${formatExerciseResponse(exercises)}\n\nAsk me about specific exercises, workout plans, nutrition, or GYM 56 info!`;
  }

  return `I'm not sure about "${text}", but I can help you with:\n\n` +
    `• **Workout plans** — Push/Pull/Legs, Upper/Lower, Full Body\n` +
    `• **Exercise form** — How to perform any exercise correctly\n` +
    `• **Nutrition** — Pre/post workout meals, supplements, diet tips\n` +
    `• **Weight loss** — Cardio, HIIT, strength training, diet\n` +
    `• **Muscle gain** — Progressive overload, sets/reps, nutrition\n` +
    `• **GYM 56 info** — Hours, location, equipment\n` +
    `• **Recovery** — Warm-ups, cool-downs, rest days, injury prevention\n\n` +
    `What would you like to know? 💪`;
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1]?.content || "";

  if (process.env.OPENAI_API_KEY) {
    const { OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const SYSTEM_PROMPT = `You are the GYM56 AI Coach — an expert fitness coach for Gym 56, a premium fitness gym in Sector 26, Gandhinagar, Gujarat, India.

Your role:
- Help with workout planning, exercise form, nutrition, weight loss, muscle gain, recovery, supplements, gym etiquette, and general injury guidance.
- When asked about exercises, provide detailed form instructions, target muscles, common mistakes, and safety tips.
- Recommend proper Gym 56 equipment for specific goals.
- Keep answers concise, motivational, and science-based.
- If asked about medical issues, always include a disclaimer to consult a doctor.
- The gym offers: Strength Training, Weight Loss programs, Personal Training.
- Equipment available: Cable crossover, lat pulldown, leg press, power rack, treadmills, spin bikes, dumbbells, barbells, EZ curl bar, leg extension/curl machine, pec deck, adjustable benches, and more.
- Gym hours: Mon-Sat 6-10 AM & 5-10 PM, Sun Closed.
- Phone: +91 99244 41179

Be encouraging but honest. Never give medical diagnoses. Never recommend illegal substances.`;

    const formattedMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  }

  const supabase = await createSupabaseServerClient();
  const response = await handleTextQuery(supabase, lastMessage);

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(response));
      controller.close();
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
