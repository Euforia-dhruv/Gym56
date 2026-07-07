import { Exercise } from "@/types";

const INSTRUCTIONS: Record<string, string[]> = {
  "barbell-bench-press": [
    "Lie flat on a bench with feet planted on the floor.",
    "Grip the barbell slightly wider than shoulder-width apart.",
    "Unrack the bar and lower it to your mid-chest with elbows at a 75-degree angle.",
    "Press the bar back up to full arm extension without locking elbows.",
    "Repeat for the desired number of reps."
  ],
  "incline-dumbbell-press": [
    "Set the bench to a 30-45 degree incline.",
    "Hold a dumbbell in each hand at shoulder height, palms facing forward.",
    "Press the dumbbells up until arms are fully extended.",
    "Lower the dumbbells slowly back to the starting position.",
    "Repeat for the desired number of reps."
  ],
  "push-ups": [
    "Start in a high plank position with hands slightly wider than shoulder-width.",
    "Keep your body in a straight line from head to heels.",
    "Lower your chest toward the floor by bending your elbows.",
    "Push through your palms to return to the starting position.",
    "Repeat for the desired number of reps."
  ],
  "dumbbell-flyes": [
    "Lie flat on a bench holding dumbbells directly above your chest with arms extended.",
    "Slightly bend your elbows and keep them fixed throughout.",
    "Lower the dumbbells out to the sides in a wide arc until you feel a chest stretch.",
    "Bring the dumbbells back together at the top, squeezing your chest."
  ],
  "decline-bench-press": [
    "Lie on a decline bench and secure your legs under the pads.",
    "Grip the barbell slightly wider than shoulder-width.",
    "Unrack the bar and lower it to your lower chest.",
    "Press the bar back up to full arm extension.",
    "Repeat for the desired number of reps."
  ],
  "bent-over-row": [
    "Stand with feet shoulder-width apart holding a barbell with an overhand grip.",
    "Hinge at the hips and bend your knees slightly, keeping your back flat.",
    "Pull the barbell toward your lower rib cage, squeezing your shoulder blades.",
    "Lower the barbell with control back to the starting position.",
    "Repeat for the desired number of reps."
  ],
  "pull-ups": [
    "Grip the pull-up bar with palms facing away, hands slightly wider than shoulder-width.",
    "Hang with arms fully extended and engage your core.",
    "Pull yourself up until your chin clears the bar.",
    "Lower yourself down with control to full arm extension.",
    "Repeat for the desired number of reps."
  ],
  "lat-pulldown": [
    "Sit at a lat pulldown machine and adjust the thigh pad to secure your legs.",
    "Grip the bar wider than shoulder-width with palms facing forward.",
    "Lean back slightly and pull the bar down to your upper chest.",
    "Slowly return the bar to the starting position with control.",
    "Repeat for the desired number of reps."
  ],
  "seated-cable-row": [
    "Sit at a cable row machine and place your feet on the platform.",
    "Grab the handle with an overhand grip, arms extended.",
    "Pull the handle toward your torso, squeezing your shoulder blades.",
    "Extend your arms back to the starting position with control.",
    "Repeat for the desired number of reps."
  ],
  "deadlift": [
    "Stand with feet hip-width apart over a barbell, shins touching the bar.",
    "Hinge at the hips and bend your knees to grip the bar, hands just outside your legs.",
    "Keep your back straight, chest up, and core braced.",
    "Drive through your heels and stand up, pulling the bar close to your legs.",
    "Lock out at the top, then lower the bar back to the floor with control."
  ],
  "overhead-shoulder-press": [
    "Stand with feet shoulder-width apart holding a barbell at shoulder height.",
    "Press the bar overhead until arms are fully extended.",
    "Lower the bar back to shoulder height with control.",
    "Repeat for the desired number of reps."
  ],
  "lateral-raises": [
    "Stand with feet shoulder-width apart holding a dumbbell in each hand at your sides.",
    "Keep your core tight and a slight bend in your elbows.",
    "Raise the dumbbells out to the sides until they reach shoulder height.",
    "Lower the dumbbells back down slowly.",
    "Repeat for the desired number of reps."
  ],
  "front-raises": [
    "Stand with feet shoulder-width apart holding dumbbells in front of your thighs.",
    "Keep your arms straight with a slight bend in your elbows.",
    "Raise the dumbbells in front of you to shoulder height.",
    "Lower the dumbbells back down slowly.",
    "Repeat for the desired number of reps."
  ],
  "face-pulls": [
    "Set a cable pulley to upper-chest height with a rope attachment.",
    "Grip the rope with both hands, palms facing each other.",
    "Step back to create tension, then pull the rope toward your face.",
    "Separate the ends of the rope as you pull, squeezing your shoulder blades.",
    "Slowly return to the starting position."
  ],
  "barbell-squat": [
    "Position the barbell on your upper back (not your neck) and unrack it.",
    "Stand with feet shoulder-width apart, toes slightly turned out.",
    "Sit back and down as if sitting in a chair, keeping your chest up.",
    "Lower until your thighs are parallel to the floor or deeper.",
    "Drive through your heels to stand back up."
  ],
  "leg-press": [
    "Sit in the leg press machine and place your feet shoulder-width apart on the platform.",
    "Release the safety handles and fully extend your legs without locking your knees.",
    "Lower the platform by bending your knees to a 90-degree angle.",
    "Press the platform back to the starting position.",
    "Repeat for the desired number of reps."
  ],
  "lunges": [
    "Stand upright holding a dumbbell in each hand at your sides.",
    "Take a large step forward with your right leg.",
    "Lower your hips until both knees are bent at 90 degrees.",
    "Push off your right foot to return to the starting position.",
    "Alternate legs for each rep."
  ],
  "romanian-deadlift": [
    "Stand with feet hip-width apart holding a barbell at hip height.",
    "Hinge at your hips and push them back as you lower the bar along your legs.",
    "Keep your back flat and knees slightly bent.",
    "Lower until you feel a stretch in your hamstrings, then drive your hips forward to return to standing.",
    "Repeat for the desired number of reps."
  ],
  "leg-extensions": [
    "Sit in the leg extension machine with the pad resting on your shins just above your ankles.",
    "Adjust the backrest so your knees are at 90 degrees.",
    "Extend your legs until they are straight, squeezing your quads.",
    "Lower the weight back down with control.",
    "Repeat for the desired number of reps."
  ],
  "leg-curls": [
    "Lie face down on the leg curl machine with the pad resting on the back of your ankles.",
    "Grip the handles and curl your legs toward your glutes.",
    "Squeeze your hamstrings at the top of the movement.",
    "Lower the weight back down with control.",
    "Repeat for the desired number of reps."
  ],
  "barbell-curl": [
    "Stand with feet shoulder-width apart holding a barbell with an underhand grip.",
    "Keep your elbows close to your torso and your core tight.",
    "Curl the barbell up toward your shoulders, squeezing your biceps.",
    "Lower the barbell back down with control.",
    "Repeat for the desired number of reps."
  ],
  "tricep-pushdown": [
    "Attach a straight bar or rope to a high cable pulley.",
    "Grip the attachment with palms facing down, elbows at 90 degrees.",
    "Keep your elbows close to your torso and push the bar down until arms are straight.",
    "Squeeze your triceps at the bottom, then slowly return to start.",
    "Repeat for the desired number of reps."
  ],
  "hammer-curls": [
    "Stand with feet shoulder-width apart holding a dumbbell in each hand at your sides.",
    "Keep your palms facing each other (neutral grip) throughout.",
    "Curl the dumbbells toward your shoulders, keeping your elbows stationary.",
    "Lower the dumbbells back down with control.",
    "Repeat for the desired number of reps."
  ],
  "overhead-tricep-extension": [
    "Stand or sit holding a dumbbell overhead with both hands, gripping the handle.",
    "Lower the dumbbell behind your head by bending your elbows.",
    "Keep your upper arms close to your ears and stationary.",
    "Extend your elbows to raise the dumbbell back to the start.",
    "Repeat for the desired number of reps."
  ],
  "plank": [
    "Start in a forearm plank position with elbows directly under your shoulders.",
    "Extend your legs behind you and balance on your toes.",
    "Keep your body in a straight line from head to heels.",
    "Engage your core and hold the position.",
    "Breathe steadily and maintain the hold for the desired time."
  ],
  "crunches": [
    "Lie on your back with knees bent and feet flat on the floor.",
    "Place your hands behind your head or cross them over your chest.",
    "Curl your shoulders and upper back off the floor, contracting your abs.",
    "Lower back down with control.",
    "Repeat for the desired number of reps."
  ],
  "hanging-leg-raises": [
    "Hang from a pull-up bar with arms fully extended and palms facing away.",
    "Engage your core and keep your body stable.",
    "Raise your legs until they are parallel to the floor or higher, keeping them straight.",
    "Lower your legs with control back to the starting position.",
    "Repeat for the desired number of reps."
  ],
  "russian-twists": [
    "Sit on the floor with knees bent and feet lifted slightly off the ground.",
    "Lean back slightly, keeping your back straight.",
    "Hold your hands together in front of your chest or hold a weight.",
    "Rotate your torso to the right, then to the left to complete one rep.",
    "Continue alternating sides."
  ],
  "glute-bridges": [
    "Lie on your back with knees bent and feet flat on the floor, hip-width apart.",
    "Place your arms at your sides with palms facing down.",
    "Drive through your heels and lift your hips toward the ceiling.",
    "Squeeze your glutes at the top, then lower back down.",
    "Repeat for the desired number of reps."
  ],
  "running": [
    "Start with a brisk warm-up walk for 3-5 minutes.",
    "Begin running at a comfortable pace, maintaining an upright posture.",
    "Land mid-foot under your hips, not heel-striking out in front.",
    "Swing your arms forward and back (not across your body).",
    "Breathe rhythmically\u20143 steps inhale, 2 steps exhale.",
    "Cool down with a 3-5 minute walk and stretch."
  ]
};

const EXERCISES: Exercise[] = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    slug: "barbell-bench-press",
    name: "Barbell Bench Press",
    category: "Chest",
    difficulty: "Beginner",
    target_muscles: ["Pectoralis Major", "Triceps Brachii"],
    secondary_muscles: ["Anterior Deltoid", "Forearms"],
    muscle_group: "Chest",
    equipment_id: null,
    equipment_label: "Barbell",
    common_mistakes: [
      "Bouncing the bar off the chest.",
      "Flaring elbows out too wide.",
      "Lifting the hips off the bench."
    ],
    safety_tips: [
      "Always use a spotter when lifting heavy.",
      "Use collars to secure the weights.",
      "Keep your wrists straight and stable."
    ],
    breathing: "Inhale as you lower the bar, exhale as you press up.",
    variations: [
      "Close-Grip Bench Press",
      "Incline Bench Press",
      "Decline Bench Press"
    ],
    alternatives: [
      "Dumbbell Bench Press",
      "Push-Ups",
      "Machine Chest Press"
    ],
    progressions: [
      "Increase weight gradually.",
      "Pause reps at the bottom."
    ],
    regressions: [
      "Use a lighter barbell or fixed-weight bar.",
      "Perform push-ups on knees."
    ],
    beginner_tips: [
      "Focus on form before adding weight.",
      "Keep your shoulder blades retracted throughout."
    ],
    pro_tips: [
      "Drive through your heels to maintain stability.",
      "Touch the bar to your sternum for full range of motion."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/barbell-bench-press.gif",
    thumbnail_url: "/images/exercises/chest.jpg",
    video_url: null,
    is_published: true,
    sort_order: 1,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000002",
    slug: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    category: "Chest",
    difficulty: "Intermediate",
    target_muscles: ["Upper Pectoralis Major", "Anterior Deltoid"],
    secondary_muscles: ["Triceps Brachii", "Serratus Anterior"],
    muscle_group: "Chest",
    equipment_id: null,
    equipment_label: "Dumbbell",
    common_mistakes: [
      "Using too steep an incline which shifts work to shoulders.",
      "Locking out elbows at the top.",
      "Flaring elbows outward."
    ],
    safety_tips: [
      "Use a spotter for heavy sets.",
      "Keep your core tight and back flat against the bench."
    ],
    breathing: "Inhale while lowering, exhale while pressing up.",
    variations: [
      "Incline Barbell Press",
      "Low-Incline Dumbbell Press",
      "Neutral-Grip Incline Press"
    ],
    alternatives: [
      "Flat Dumbbell Press",
      "Incline Barbell Bench Press",
      "Push-Ups with feet elevated"
    ],
    progressions: [
      "Increase dumbbell weight.",
      "Slow down the eccentric phase."
    ],
    regressions: [
      "Use lighter dumbbells.",
      "Perform the press on a flat bench."
    ],
    beginner_tips: [
      "Keep the incline moderate to target the upper chest.",
      "Squeeze your shoulder blades together."
    ],
    pro_tips: [
      "Drive the dumbbells in an arc toward each other at the top.",
      "Pause briefly at the bottom stretch."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/incline-dumbbell-press.gif",
    thumbnail_url: "/images/exercises/chest.jpg",
    video_url: null,
    is_published: true,
    sort_order: 2,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000003",
    slug: "push-ups",
    name: "Push-Ups",
    category: "Chest",
    difficulty: "Beginner",
    target_muscles: ["Pectoralis Major", "Triceps Brachii"],
    secondary_muscles: ["Anterior Deltoid", "Core"],
    muscle_group: "Chest",
    equipment_id: null,
    equipment_label: "Bodyweight",
    common_mistakes: [
      "Letting the hips sag or pike up.",
      "Flaring elbows out too wide.",
      "Not going through full range of motion."
    ],
    safety_tips: [
      "Warm up your wrists and shoulders first.",
      "Stop if you feel sharp shoulder pain."
    ],
    breathing: "Inhale as you lower, exhale as you push up.",
    variations: [
      "Wide Push-Ups",
      "Diamond Push-Ups",
      "Decline Push-Ups"
    ],
    alternatives: [
      "Dumbbell Bench Press",
      "Machine Chest Press",
      "Knee Push-Ups"
    ],
    progressions: [
      "Add a weight vest.",
      "Perform one-arm push-ups."
    ],
    regressions: [
      "Perform push-ups on knees.",
      "Perform incline push-ups using a bench."
    ],
    beginner_tips: [
      "Keep your neck neutral by looking at the floor.",
      "Engage your core to prevent sagging."
    ],
    pro_tips: [
      "Explode up during the concentric phase.",
      "Pause at the bottom for 1-2 seconds."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/push-ups.gif",
    thumbnail_url: "/images/exercises/chest.jpg",
    video_url: null,
    is_published: true,
    sort_order: 3,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000004",
    slug: "dumbbell-flyes",
    name: "Dumbbell Flyes",
    category: "Chest",
    difficulty: "Intermediate",
    target_muscles: ["Pectoralis Major"],
    secondary_muscles: ["Anterior Deltoid", "Biceps Brachii"],
    muscle_group: "Chest",
    equipment_id: null,
    equipment_label: "Dumbbell",
    common_mistakes: [
      "Bending the elbows too much, turning it into a press.",
      "Using too much weight and losing control.",
      "Lowering the dumbbells too low and straining the shoulders."
    ],
    safety_tips: [
      "Use a moderate weight to protect your shoulder joints.",
      "Keep the movement controlled\u2014avoid jerking."
    ],
    breathing: "Inhale as you lower, exhale as you bring the dumbbells up.",
    variations: [
      "Incline Dumbbell Flyes",
      "Cable Flyes",
      "Decline Dumbbell Flyes"
    ],
    alternatives: [
      "Cable Crossovers",
      "Pec Deck Machine",
      "Push-Ups"
    ],
    progressions: [
      "Increase dumbbell weight gradually.",
      "Slow down the eccentric phase."
    ],
    regressions: [
      "Use lighter dumbbells.",
      "Perform the movement on a cable machine."
    ],
    beginner_tips: [
      "Keep a slight bend in your elbows throughout.",
      "Imagine you are hugging a barrel at the top."
    ],
    pro_tips: [
      "Hold the squeeze at the top for 1-2 seconds.",
      "Flare the elbows slightly less to protect the shoulders."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/dumbbell-flyes.gif",
    thumbnail_url: "/images/exercises/chest.jpg",
    video_url: null,
    is_published: true,
    sort_order: 4,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000005",
    slug: "decline-bench-press",
    name: "Decline Bench Press",
    category: "Chest",
    difficulty: "Intermediate",
    target_muscles: ["Lower Pectoralis Major", "Triceps Brachii"],
    secondary_muscles: ["Anterior Deltoid"],
    muscle_group: "Chest",
    equipment_id: null,
    equipment_label: "Barbell",
    common_mistakes: [
      "Lowering the bar too high on the chest.",
      "Bouncing the bar off the chest.",
      "Using momentum to press the weight."
    ],
    safety_tips: [
      "Ensure the bench is securely locked at the decline angle.",
      "Use a spotter for heavy sets."
    ],
    breathing: "Inhale as you lower, exhale as you press up.",
    variations: [
      "Decline Dumbbell Press",
      "Decline Push-Ups",
      "Weighted Decline Push-Ups"
    ],
    alternatives: [
      "Flat Bench Press",
      "Dips",
      "Machine Chest Press"
    ],
    progressions: [
      "Increase the weight progressively.",
      "Add pause reps at the bottom."
    ],
    regressions: [
      "Use a lighter barbell.",
      "Perform on a flat bench instead."
    ],
    beginner_tips: [
      "Keep your elbows at a 45-60 degree angle.",
      "Maintain a tight upper back."
    ],
    pro_tips: [
      "Arch your upper back slightly for better stability.",
      "Drive the bar toward your sternum."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/decline-bench-press.gif",
    thumbnail_url: "/images/exercises/chest.jpg",
    video_url: null,
    is_published: true,
    sort_order: 5,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000006",
    slug: "bent-over-row",
    name: "Bent Over Row",
    category: "Back",
    difficulty: "Intermediate",
    target_muscles: ["Latissimus Dorsi", "Rhomboids"],
    secondary_muscles: ["Trapezius", "Posterior Deltoid", "Biceps Brachii", "Erector Spinae"],
    muscle_group: "Back",
    equipment_id: null,
    equipment_label: "Barbell",
    common_mistakes: [
      "Rounding the lower back.",
      "Using momentum instead of controlled pulling.",
      "Pulling the bar too high toward the chest."
    ],
    safety_tips: [
      "Keep your core braced throughout.",
      "Use a manageable weight to maintain form."
    ],
    breathing: "Exhale as you pull the bar up, inhale as you lower it.",
    variations: [
      "Pendlay Row",
      "Dumbbell Row",
      "T-Bar Row"
    ],
    alternatives: [
      "Seated Cable Row",
      "Dumbbell Row",
      "Machine Row"
    ],
    progressions: [
      "Increase the weight gradually.",
      "Use a slow eccentric (3-4 seconds)."
    ],
    regressions: [
      "Use a lighter barbell.",
      "Perform with dumbbells for better range of motion."
    ],
    beginner_tips: [
      "Keep your back at a 45-degree angle to the floor.",
      "Squeeze your shoulder blades at the top."
    ],
    pro_tips: [
      "Pull the bar to your belly button, not your chest.",
      "Use a hook grip for heavier loads."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/bent-over-row.gif",
    thumbnail_url: "/images/exercises/back.jpg",
    video_url: null,
    is_published: true,
    sort_order: 6,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000007",
    slug: "pull-ups",
    name: "Pull-Ups",
    category: "Back",
    difficulty: "Intermediate",
    target_muscles: ["Latissimus Dorsi", "Biceps Brachii"],
    secondary_muscles: ["Rhomboids", "Trapezius", "Posterior Deltoid", "Core"],
    muscle_group: "Back",
    equipment_id: null,
    equipment_label: "Bodyweight",
    common_mistakes: [
      "Using kipping momentum instead of strict pulling.",
      "Not achieving full range of motion.",
      "Looking up and straining the neck."
    ],
    safety_tips: [
      "Warm up your shoulders and wrists first.",
      "Avoid swinging your body."
    ],
    breathing: "Exhale as you pull up, inhale as you lower down.",
    variations: [
      "Wide-Grip Pull-Ups",
      "Chin-Ups (palms facing you)",
      "Commando Pull-Ups"
    ],
    alternatives: [
      "Lat Pulldown",
      "Assisted Pull-Ups",
      "Negative Pull-Ups"
    ],
    progressions: [
      "Add weight using a dip belt.",
      "Perform archer pull-ups."
    ],
    regressions: [
      "Use a resistance band for assistance.",
      "Perform negative pull-ups (jump up, lower slowly)."
    ],
    beginner_tips: [
      "Use a band for assistance if needed.",
      "Focus on the negative (lowering) phase."
    ],
    pro_tips: [
      "Pull your elbows down and back, not just forward.",
      "Pause at the top for a hard squeeze."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/pull-ups.gif",
    thumbnail_url: "/images/exercises/back.jpg",
    video_url: null,
    is_published: true,
    sort_order: 7,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000008",
    slug: "lat-pulldown",
    name: "Lat Pulldown",
    category: "Back",
    difficulty: "Beginner",
    target_muscles: ["Latissimus Dorsi"],
    secondary_muscles: ["Biceps Brachii", "Rhomboids", "Posterior Deltoid"],
    muscle_group: "Back",
    equipment_id: null,
    equipment_label: "Cable",
    common_mistakes: [
      "Pulling the bar behind the neck.",
      "Using too much body momentum.",
      "Not getting a full stretch at the top."
    ],
    safety_tips: [
      "Do not pull the bar behind your neck\u2014pull to your chest.",
      "Keep your feet flat on the floor."
    ],
    breathing: "Exhale as you pull down, inhale as you release up.",
    variations: [
      "Wide-Grip Lat Pulldown",
      "Reverse-Grip Lat Pulldown",
      "V-Grip Lat Pulldown"
    ],
    alternatives: [
      "Pull-Ups",
      "Assisted Pull-Ups",
      "Seated Cable Row"
    ],
    progressions: [
      "Increase the weight stack.",
      "Slow down the eccentric phase."
    ],
    regressions: [
      "Use a lighter weight.",
      "Use a closer grip to make the movement easier."
    ],
    beginner_tips: [
      "Keep your chest up and shoulders down.",
      "Pull the bar to the top of your chest."
    ],
    pro_tips: [
      "Imagine you are pulling your elbows down to your hips.",
      "Pause at the bottom and squeeze your lats."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/lat-pulldown.gif",
    thumbnail_url: "/images/exercises/back.jpg",
    video_url: null,
    is_published: true,
    sort_order: 8,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000009",
    slug: "seated-cable-row",
    name: "Seated Cable Row",
    category: "Back",
    difficulty: "Beginner",
    target_muscles: ["Latissimus Dorsi", "Rhomboids"],
    secondary_muscles: ["Biceps Brachii", "Posterior Deltoid", "Trapezius"],
    muscle_group: "Back",
    equipment_id: null,
    equipment_label: "Cable",
    common_mistakes: [
      "Rounding the back at the end of the pull.",
      "Using the legs to pull the weight.",
      "Leaning too far forward on the release."
    ],
    safety_tips: [
      "Keep your back straight throughout the movement.",
      "Avoid jerking the weight."
    ],
    breathing: "Exhale as you pull, inhale as you release.",
    variations: [
      "V-Grip Cable Row",
      "Wide-Grip Cable Row",
      "Single-Arm Cable Row"
    ],
    alternatives: [
      "Bent Over Row",
      "Dumbbell Row",
      "T-Bar Row"
    ],
    progressions: [
      "Increase the weight stack.",
      "Perform pause reps at peak contraction."
    ],
    regressions: [
      "Use a lighter weight.",
      "Use a V-grip handle for a more natural pull."
    ],
    beginner_tips: [
      "Keep your chest proud and shoulders down.",
      "Pull the handle to your belly button."
    ],
    pro_tips: [
      "Hold the squeeze for 1-2 seconds at full contraction.",
      "Keep your elbows close to your body."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/seated-cable-row.gif",
    thumbnail_url: "/images/exercises/back.jpg",
    video_url: null,
    is_published: true,
    sort_order: 9,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000010",
    slug: "deadlift",
    name: "Deadlift",
    category: "Back",
    difficulty: "Advanced",
    target_muscles: ["Erector Spinae", "Gluteus Maximus", "Hamstrings"],
    secondary_muscles: ["Trapezius", "Forearms", "Core", "Quadriceps"],
    muscle_group: "Back",
    equipment_id: null,
    equipment_label: "Barbell",
    common_mistakes: [
      "Rounding the lower back.",
      "Jerking the bar off the floor.",
      "Letting the bar drift forward from the body."
    ],
    safety_tips: [
      "Always warm up thoroughly before heavy sets.",
      "Use a mixed grip or lifting straps for heavy loads.",
      "Keep the bar in contact with your legs throughout."
    ],
    breathing: "Take a deep breath and brace before each rep, exhale after lockout.",
    variations: [
      "Sumo Deadlift",
      "Romanian Deadlift",
      "Trap Bar Deadlift"
    ],
    alternatives: [
      "Romanian Deadlift",
      "Rack Pulls",
      "Hip Thrusts"
    ],
    progressions: [
      "Increase weight progressively.",
      "Add deficit deadlifts for more range of motion."
    ],
    regressions: [
      "Use a lighter barbell or trap bar.",
      "Perform rack pulls from higher pins."
    ],
    beginner_tips: [
      "Keep the bar over the middle of your foot.",
      "Start with your hips slightly higher than your knees."
    ],
    pro_tips: [
      "Pull the slack out of the bar before lifting.",
      "Use your lats to keep the bar close to your body."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/deadlift.gif",
    thumbnail_url: "/images/exercises/back.jpg",
    video_url: null,
    is_published: true,
    sort_order: 10,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000011",
    slug: "overhead-shoulder-press",
    name: "Overhead Shoulder Press",
    category: "Shoulders",
    difficulty: "Intermediate",
    target_muscles: ["Anterior Deltoid", "Lateral Deltoid"],
    secondary_muscles: ["Triceps Brachii", "Trapezius", "Core"],
    muscle_group: "Shoulders",
    equipment_id: null,
    equipment_label: "Barbell",
    common_mistakes: [
      "Arching the lower back excessively.",
      "Locking out the elbows too hard.",
      "Not keeping the core braced."
    ],
    safety_tips: [
      "Use a spotter for heavy sets.",
      "Keep your wrists straight and in line with your forearms."
    ],
    breathing: "Exhale as you press up, inhale as you lower the bar.",
    variations: [
      "Seated Dumbbell Press",
      "Arnold Press",
      "Push Press"
    ],
    alternatives: [
      "Dumbbell Shoulder Press",
      "Machine Shoulder Press",
      "Handstand Push-Ups"
    ],
    progressions: [
      "Increase weight progressively.",
      "Perform slow negative reps."
    ],
    regressions: [
      "Use dumbbells instead of a barbell.",
      "Perform seated press to reduce lower back strain."
    ],
    beginner_tips: [
      "Squeeze your glutes to stabilize your lower body.",
      "Keep the bar path straight up, not arcing forward."
    ],
    pro_tips: [
      "Press the bar slightly behind your head for a better bar path.",
      "Brace your core before each rep."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/overhead-shoulder-press.gif",
    thumbnail_url: "/images/exercises/shoulders.jpg",
    video_url: null,
    is_published: true,
    sort_order: 11,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000012",
    slug: "lateral-raises",
    name: "Lateral Raises",
    category: "Shoulders",
    difficulty: "Beginner",
    target_muscles: ["Lateral Deltoid"],
    secondary_muscles: ["Anterior Deltoid", "Trapezius", "Serratus Anterior"],
    muscle_group: "Shoulders",
    equipment_id: null,
    equipment_label: "Dumbbell",
    common_mistakes: [
      "Using momentum to swing the weights up.",
      "Raising the dumbbells higher than shoulder height.",
      "Shrugging the shoulders during the movement."
    ],
    safety_tips: [
      "Use a light weight to avoid straining the rotator cuff.",
      "Keep your shoulders down away from your ears."
    ],
    breathing: "Exhale as you raise, inhale as you lower.",
    variations: [
      "Cable Lateral Raise",
      "Leaning Lateral Raise",
      "Single-Arm Lateral Raise"
    ],
    alternatives: [
      "Front Raises",
      "Upright Rows",
      "Reverse Flyes"
    ],
    progressions: [
      "Use heavier dumbbells.",
      "Slow down the eccentric phase."
    ],
    regressions: [
      "Use very light dumbbells or no weight.",
      "Perform seated to eliminate momentum."
    ],
    beginner_tips: [
      "Lead with your elbows, not your hands.",
      "Imagine pouring a pitcher of water at the top."
    ],
    pro_tips: [
      "Pause for 1-2 seconds at the top of the movement.",
      "Keep the pinky finger slightly higher than the thumb."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/lateral-raises.gif",
    thumbnail_url: "/images/exercises/shoulders.jpg",
    video_url: null,
    is_published: true,
    sort_order: 12,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000013",
    slug: "front-raises",
    name: "Front Raises",
    category: "Shoulders",
    difficulty: "Beginner",
    target_muscles: ["Anterior Deltoid"],
    secondary_muscles: ["Lateral Deltoid", "Trapezius", "Pectoralis Major (Clavicular)"],
    muscle_group: "Shoulders",
    equipment_id: null,
    equipment_label: "Dumbbell",
    common_mistakes: [
      "Swinging the body to generate momentum.",
      "Raising the dumbbells above shoulder height.",
      "Locking the elbows completely."
    ],
    safety_tips: [
      "Do not use too heavy a weight to avoid shoulder strain.",
      "Keep your shoulders down and back."
    ],
    breathing: "Exhale as you raise, inhale as you lower.",
    variations: [
      "Cable Front Raise",
      "Plate Front Raise",
      "Alternating Front Raise"
    ],
    alternatives: [
      "Lateral Raises",
      "Overhead Press",
      "Upright Rows"
    ],
    progressions: [
      "Increase dumbbell weight.",
      "Perform single-arm with more focus."
    ],
    regressions: [
      "Use lighter dumbbells.",
      "Perform one arm at a time."
    ],
    beginner_tips: [
      "Keep your palms facing down throughout.",
      "Raise to eye level, not higher."
    ],
    pro_tips: [
      "Pause at the top to maximize time under tension.",
      "Use a cable for constant tension."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/front-raises.gif",
    thumbnail_url: "/images/exercises/shoulders.jpg",
    video_url: null,
    is_published: true,
    sort_order: 13,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000014",
    slug: "face-pulls",
    name: "Face Pulls",
    category: "Shoulders",
    difficulty: "Intermediate",
    target_muscles: ["Posterior Deltoid", "Trapezius"],
    secondary_muscles: ["Rhomboids", "Rotator Cuff", "Rear Delts"],
    muscle_group: "Shoulders",
    equipment_id: null,
    equipment_label: "Cable",
    common_mistakes: [
      "Using too much weight and sacrificing form.",
      "Pulling the rope too low toward the neck.",
      "Not externally rotating at the end."
    ],
    safety_tips: [
      "Use a weight that allows full control.",
      "Keep your shoulders down and back."
    ],
    breathing: "Exhale as you pull, inhale as you release.",
    variations: [
      "Band Face Pulls",
      "Dumbbell Face Pulls",
      "Standing Face Pulls with Rope"
    ],
    alternatives: [
      "Reverse Flyes",
      "Rear Delt Rows",
      "Band Pull-Aparts"
    ],
    progressions: [
      "Increase the weight stack.",
      "Slow down the eccentric phase."
    ],
    regressions: [
      "Use a lighter weight.",
      "Use resistance bands for easier setup."
    ],
    beginner_tips: [
      "Focus on squeezing the rear delts at the end.",
      "Keep your elbows high throughout the movement."
    ],
    pro_tips: [
      "Imagine a string pulling your elbows back and apart.",
      "Pause and squeeze for 2 seconds at full contraction."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/face-pulls.gif",
    thumbnail_url: "/images/exercises/shoulders.jpg",
    video_url: null,
    is_published: true,
    sort_order: 14,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000015",
    slug: "barbell-squat",
    name: "Barbell Squat",
    category: "Legs",
    difficulty: "Intermediate",
    target_muscles: ["Quadriceps", "Gluteus Maximus"],
    secondary_muscles: ["Hamstrings", "Erector Spinae", "Core", "Calves"],
    muscle_group: "Legs",
    equipment_id: null,
    equipment_label: "Barbell",
    common_mistakes: [
      "Knees caving inward.",
      "Rounding the lower back.",
      "Rising onto the toes at the bottom."
    ],
    safety_tips: [
      "Always use a squat rack with safety pins.",
      "Keep your core braced throughout the movement."
    ],
    breathing: "Inhale and brace before descending, exhale as you stand up.",
    variations: [
      "Front Squat",
      "Goblet Squat",
      "Box Squat"
    ],
    alternatives: [
      "Leg Press",
      "Goblet Squat",
      "Bulgarian Split Squat"
    ],
    progressions: [
      "Increase the weight progressively.",
      "Perform pause squats at the bottom."
    ],
    regressions: [
      "Use a lighter weight or goblet squat holding a dumbbell.",
      "Perform bodyweight squats."
    ],
    beginner_tips: [
      "Keep your gaze forward or slightly upward.",
      "Push your knees out as you descend."
    ],
    pro_tips: [
      "Brace your core as if someone is about to punch your stomach.",
      "Use lifting shoes with a raised heel for better depth."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/barbell-squat.gif",
    thumbnail_url: "/images/exercises/legs.jpg",
    video_url: null,
    is_published: true,
    sort_order: 15,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000016",
    slug: "leg-press",
    name: "Leg Press",
    category: "Legs",
    difficulty: "Beginner",
    target_muscles: ["Quadriceps", "Gluteus Maximus"],
    secondary_muscles: ["Hamstrings", "Calves"],
    muscle_group: "Legs",
    equipment_id: null,
    equipment_label: "Machine",
    common_mistakes: [
      "Locking the knees at full extension.",
      "Letting the lower back lift off the seat.",
      "Going too deep and losing core stability."
    ],
    safety_tips: [
      "Always use the safety stops.",
      "Keep your back flat against the pad."
    ],
    breathing: "Exhale as you press, inhale as you lower.",
    variations: [
      "Single-Leg Press",
      "High Foot Placement (glutes focus)",
      "Low Foot Placement (quads focus)"
    ],
    alternatives: [
      "Barbell Squat",
      "Goblet Squat",
      "Hack Squat"
    ],
    progressions: [
      "Add more weight plates.",
      "Perform single-leg presses."
    ],
    regressions: [
      "Use lighter weight.",
      "Reduce the range of motion."
    ],
    beginner_tips: [
      "Keep your feet flat on the platform.",
      "Do not let your knees cave inward."
    ],
    pro_tips: [
      "Pause at the bottom to eliminate momentum.",
      "Vary foot placement to target different muscles."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/leg-press.gif",
    thumbnail_url: "/images/exercises/legs.jpg",
    video_url: null,
    is_published: true,
    sort_order: 16,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000017",
    slug: "lunges",
    name: "Lunges",
    category: "Legs",
    difficulty: "Intermediate",
    target_muscles: ["Quadriceps", "Gluteus Maximus"],
    secondary_muscles: ["Hamstrings", "Calves", "Core"],
    muscle_group: "Legs",
    equipment_id: null,
    equipment_label: "Dumbbell",
    common_mistakes: [
      "Letting the front knee travel past the toes.",
      "Leaning the torso forward.",
      "Taking too short a step."
    ],
    safety_tips: [
      "Keep your front knee aligned with your ankle.",
      "Use a mirror to check your form."
    ],
    breathing: "Inhale as you lunge down, exhale as you push back up.",
    variations: [
      "Walking Lunges",
      "Reverse Lunges",
      "Bulgarian Split Squats"
    ],
    alternatives: [
      "Step-Ups",
      "Bulgarian Split Squats",
      "Leg Press"
    ],
    progressions: [
      "Hold heavier dumbbells.",
      "Add a barbell for weighted lunges."
    ],
    regressions: [
      "Perform stationary lunges without weights.",
      "Use a shorter range of motion."
    ],
    beginner_tips: [
      "Keep your torso upright throughout.",
      "Land softly on your heel."
    ],
    pro_tips: [
      "Focus on driving through the heel of your front foot.",
      "Use a glute emphasis by leaning slightly forward."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/lunges.gif",
    thumbnail_url: "/images/exercises/legs.jpg",
    video_url: null,
    is_published: true,
    sort_order: 17,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000018",
    slug: "romanian-deadlift",
    name: "Romanian Deadlift",
    category: "Legs",
    difficulty: "Intermediate",
    target_muscles: ["Hamstrings", "Gluteus Maximus"],
    secondary_muscles: ["Erector Spinae", "Forearms", "Core"],
    muscle_group: "Legs",
    equipment_id: null,
    equipment_label: "Barbell",
    common_mistakes: [
      "Rounding the lower back.",
      "Bending the knees too much (turning it into a squat).",
      "Letting the bar drift away from the legs."
    ],
    safety_tips: [
      "Use a manageable weight to protect your lower back.",
      "Keep the bar close to your body at all times."
    ],
    breathing: "Inhale as you lower, exhale as you drive your hips forward.",
    variations: [
      "Single-Leg Romanian Deadlift",
      "Dumbbell Romanian Deadlift",
      "Barbell Romanian Deadlift with deficit"
    ],
    alternatives: [
      "Conventional Deadlift",
      "Glute Ham Raise",
      "Leg Curls"
    ],
    progressions: [
      "Increase the weight.",
      "Use a deficit (stand on a plate) for more range of motion."
    ],
    regressions: [
      "Use dumbbells instead of a barbell.",
      "Reduce the range of motion."
    ],
    beginner_tips: [
      "Push your hips back as far as possible.",
      "Keep a micro-bend in your knees."
    ],
    pro_tips: [
      "Imagine there is a wall behind you that you are trying to touch with your glutes.",
      "Pause at the bottom for a deep stretch."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/romanian-deadlift.gif",
    thumbnail_url: "/images/exercises/legs.jpg",
    video_url: null,
    is_published: true,
    sort_order: 18,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000019",
    slug: "leg-extensions",
    name: "Leg Extensions",
    category: "Legs",
    difficulty: "Beginner",
    target_muscles: ["Quadriceps"],
    secondary_muscles: ["Rectus Femoris"],
    muscle_group: "Legs",
    equipment_id: null,
    equipment_label: "Machine",
    common_mistakes: [
      "Kicking the weight up too quickly with momentum.",
      "Locking the knees at full extension.",
      "Lifting the hips off the seat."
    ],
    safety_tips: [
      "Do not use excessive weight that causes jerking.",
      "Keep your back flat against the pad."
    ],
    breathing: "Exhale as you extend, inhale as you lower.",
    variations: [
      "Single-Leg Extension",
      "Alternating Leg Extensions",
      "Leg Extension with pause at top"
    ],
    alternatives: [
      "Barbell Squat",
      "Leg Press",
      "Goblet Squat"
    ],
    progressions: [
      "Increase the weight stack.",
      "Perform drop sets."
    ],
    regressions: [
      "Use lighter weight.",
      "Reduce range of motion."
    ],
    beginner_tips: [
      "Squeeze your quads at the top for 1-2 seconds.",
      "Control the eccentric (lowering) phase."
    ],
    pro_tips: [
      "Point your toes slightly outward to engage more quad fibers.",
      "Do not rest the weight on the stack between reps."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/leg-extensions.gif",
    thumbnail_url: "/images/exercises/legs.jpg",
    video_url: null,
    is_published: true,
    sort_order: 19,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000020",
    slug: "leg-curls",
    name: "Leg Curls",
    category: "Legs",
    difficulty: "Beginner",
    target_muscles: ["Hamstrings"],
    secondary_muscles: ["Gastrocnemius"],
    muscle_group: "Legs",
    equipment_id: null,
    equipment_label: "Machine",
    common_mistakes: [
      "Using momentum to swing the weight up.",
      "Lifting your hips off the bench.",
      "Not achieving full range of motion."
    ],
    safety_tips: [
      "Keep your hips pressed into the bench.",
      "Do not hyperextend at the top."
    ],
    breathing: "Exhale as you curl, inhale as you lower.",
    variations: [
      "Seated Leg Curl",
      "Single-Leg Curl",
      "Swiss Ball Leg Curl"
    ],
    alternatives: [
      "Romanian Deadlift",
      "Glute Ham Raise",
      "Nordic Curls"
    ],
    progressions: [
      "Increase the weight stack.",
      "Perform slow negatives."
    ],
    regressions: [
      "Use lighter weight.",
      "Perform seated leg curls for better form."
    ],
    beginner_tips: [
      "Keep your toes pointed down throughout.",
      "Squeeze at the top for maximum contraction."
    ],
    pro_tips: [
      "Pause at the top for 1-2 seconds.",
      "Drive your hips into the bench for stability."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/leg-curls.gif",
    thumbnail_url: "/images/exercises/legs.jpg",
    video_url: null,
    is_published: true,
    sort_order: 20,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000021",
    slug: "barbell-curl",
    name: "Barbell Curl",
    category: "Arms",
    difficulty: "Beginner",
    target_muscles: ["Biceps Brachii"],
    secondary_muscles: ["Brachialis", "Forearms"],
    muscle_group: "Arms",
    equipment_id: null,
    equipment_label: "Barbell",
    common_mistakes: [
      "Swinging your body to lift the weight.",
      "Flaring the elbows out.",
      "Lowering the bar too quickly."
    ],
    safety_tips: [
      "Do not jerk the weight up\u2014use controlled motion.",
      "Keep your wrists straight."
    ],
    breathing: "Exhale as you curl up, inhale as you lower.",
    variations: [
      "EZ Bar Curl",
      "Close-Grip Barbell Curl",
      "Wide-Grip Barbell Curl"
    ],
    alternatives: [
      "Dumbbell Curl",
      "Hammer Curl",
      "Cable Curl"
    ],
    progressions: [
      "Increase the weight.",
      "Perform 21s (7 partials bottom, 7 partials top, 7 full)."
    ],
    regressions: [
      "Use a lighter barbell.",
      "Use an EZ bar for less wrist strain."
    ],
    beginner_tips: [
      "Keep your elbows pinned to your sides.",
      "Squeeze your biceps at the top."
    ],
    pro_tips: [
      "Slow down the eccentric phase to 3-4 seconds.",
      "Lean forward slightly to increase range of motion."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/barbell-curl.gif",
    thumbnail_url: "/images/exercises/arms.jpg",
    video_url: null,
    is_published: true,
    sort_order: 21,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000022",
    slug: "tricep-pushdown",
    name: "Tricep Pushdown",
    category: "Arms",
    difficulty: "Beginner",
    target_muscles: ["Triceps Brachii"],
    secondary_muscles: ["Forearms", "Anconeus"],
    muscle_group: "Arms",
    equipment_id: null,
    equipment_label: "Cable",
    common_mistakes: [
      "Flaring the elbows outward.",
      "Using your body weight to push the weight down.",
      "Not achieving full extension."
    ],
    safety_tips: [
      "Keep your wrists neutral.",
      "Use a weight you can control."
    ],
    breathing: "Exhale as you push down, inhale as you return.",
    variations: [
      "Rope Pushdown",
      "Reverse Grip Pushdown",
      "Single-Arm Pushdown"
    ],
    alternatives: [
      "Overhead Tricep Extension",
      "Close-Grip Bench Press",
      "Diamond Push-Ups"
    ],
    progressions: [
      "Increase the weight stack.",
      "Perform slow negatives."
    ],
    regressions: [
      "Use lighter weight.",
      "Use a band for similar motion."
    ],
    beginner_tips: [
      "Keep your upper arms stationary throughout.",
      "Focus on squeezing the triceps at the bottom."
    ],
    pro_tips: [
      "Lean forward slightly for better leverage.",
      "Pause at full extension for 1-2 seconds."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/tricep-pushdown.gif",
    thumbnail_url: "/images/exercises/arms.jpg",
    video_url: null,
    is_published: true,
    sort_order: 22,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000023",
    slug: "hammer-curls",
    name: "Hammer Curls",
    category: "Arms",
    difficulty: "Intermediate",
    target_muscles: ["Brachialis", "Brachioradialis"],
    secondary_muscles: ["Biceps Brachii", "Forearms"],
    muscle_group: "Arms",
    equipment_id: null,
    equipment_label: "Dumbbell",
    common_mistakes: [
      "Swinging the body for momentum.",
      "Turning the palms up (turning into a regular curl).",
      "Using elbows that drift forward."
    ],
    safety_tips: [
      "Keep your wrists neutral to avoid strain.",
      "Use controlled motions."
    ],
    breathing: "Exhale as you curl up, inhale as you lower.",
    variations: [
      "Cross-Body Hammer Curl",
      "Seated Hammer Curl",
      "Cable Hammer Curl"
    ],
    alternatives: [
      "Barbell Curl",
      "Reverse Curl",
      "Dumbbell Curl"
    ],
    progressions: [
      "Increase dumbbell weight.",
      "Perform alternating hammer curls."
    ],
    regressions: [
      "Use lighter dumbbells.",
      "Perform one arm at a time."
    ],
    beginner_tips: [
      "Keep your palms facing each other throughout.",
      "Squeeze your biceps at the top."
    ],
    pro_tips: [
      "Curl the dumbbells slightly across your body for more brachialis activation.",
      "Slow down the negative phase for more time under tension."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/hammer-curls.gif",
    thumbnail_url: "/images/exercises/arms.jpg",
    video_url: null,
    is_published: true,
    sort_order: 23,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000024",
    slug: "overhead-tricep-extension",
    name: "Overhead Tricep Extension",
    category: "Arms",
    difficulty: "Intermediate",
    target_muscles: ["Triceps Brachii (Long Head)"],
    secondary_muscles: ["Forearms", "Anconeus"],
    muscle_group: "Arms",
    equipment_id: null,
    equipment_label: "Dumbbell",
    common_mistakes: [
      "Flaring elbows out.",
      "Using too heavy a weight and losing control.",
      "Not keeping the upper arms vertical."
    ],
    safety_tips: [
      "Use a light weight until you are comfortable with the movement.",
      "Keep your core tight to avoid arching the lower back."
    ],
    breathing: "Inhale as you lower, exhale as you extend.",
    variations: [
      "Single-Arm Overhead Tricep Extension",
      "Cable Overhead Extension",
      "EZ Bar Overhead Extension"
    ],
    alternatives: [
      "Tricep Pushdown",
      "Close-Grip Bench Press",
      "Skull Crushers"
    ],
    progressions: [
      "Increase dumbbell weight.",
      "Perform with a slow eccentric."
    ],
    regressions: [
      "Use a lighter dumbbell.",
      "Perform lying tricep extensions instead."
    ],
    beginner_tips: [
      "Keep your elbows pointing straight up toward the ceiling.",
      "Lower the weight behind your head, not to the side."
    ],
    pro_tips: [
      "Pause at the bottom for a deep stretch.",
      "Use a rope attachment on a low cable for constant tension."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/overhead-tricep-extension.gif",
    thumbnail_url: "/images/exercises/arms.jpg",
    video_url: null,
    is_published: true,
    sort_order: 24,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000025",
    slug: "plank",
    name: "Plank",
    category: "Core",
    difficulty: "Beginner",
    target_muscles: ["Rectus Abdominis", "Transverse Abdominis"],
    secondary_muscles: ["Obliques", "Lower Back", "Shoulders"],
    muscle_group: "Core",
    equipment_id: null,
    equipment_label: "Bodyweight",
    common_mistakes: [
      "Letting the hips sag toward the floor.",
      "Piking the hips up too high.",
      "Holding your breath."
    ],
    safety_tips: [
      "Keep your neck neutral by looking at the floor.",
      "Stop if you feel lower back pain."
    ],
    breathing: "Breathe steadily and deeply throughout the hold.",
    variations: [
      "Side Plank",
      "Plank with Arm Raise",
      "Plank with Leg Lift"
    ],
    alternatives: [
      "Dead Bug",
      "Ab Wheel Rollout",
      "Bird Dog"
    ],
    progressions: [
      "Increase hold duration.",
      "Add a weight plate on your back."
    ],
    regressions: [
      "Drop to your knees for an easier plank.",
      "Perform on an incline."
    ],
    beginner_tips: [
      "Squeeze your glutes and quads to help stabilize.",
      "Think about pulling your belly button toward your spine."
    ],
    pro_tips: [
      "Pull your elbows toward your toes to create full-body tension.",
      "Breathe into your ribcage, not your belly."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/plank.gif",
    thumbnail_url: "/images/exercises/core.jpg",
    video_url: null,
    is_published: true,
    sort_order: 25,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000026",
    slug: "crunches",
    name: "Crunches",
    category: "Abs",
    difficulty: "Beginner",
    target_muscles: ["Rectus Abdominis"],
    secondary_muscles: ["Obliques"],
    muscle_group: "Abs",
    equipment_id: null,
    equipment_label: "Bodyweight",
    common_mistakes: [
      "Pulling on the neck with your hands.",
      "Using momentum to curl up.",
      "Lifting the lower back off the floor."
    ],
    safety_tips: [
      "Keep your lower back pressed into the floor.",
      "Do not yank on your neck."
    ],
    breathing: "Exhale as you curl up, inhale as you lower down.",
    variations: [
      "Reverse Crunch",
      "Bicycle Crunch",
      "Cable Crunch"
    ],
    alternatives: [
      "Sit-Ups",
      "Plank",
      "Ab Rollouts"
    ],
    progressions: [
      "Add weight on your chest.",
      "Perform on a decline bench."
    ],
    regressions: [
      "Keep your feet on the floor with knees bent.",
      "Perform smaller range of motion crunches."
    ],
    beginner_tips: [
      "Tuck your chin slightly to keep neck neutral.",
      "Imagine crushing an orange between your chin and chest."
    ],
    pro_tips: [
      "Focus on contracting the upper abs.",
      "Slow down the movement\u20142 seconds up, 2 seconds down."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/crunches.gif",
    thumbnail_url: "/images/exercises/abs.jpg",
    video_url: null,
    is_published: true,
    sort_order: 26,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000027",
    slug: "hanging-leg-raises",
    name: "Hanging Leg Raises",
    category: "Abs",
    difficulty: "Advanced",
    target_muscles: ["Rectus Abdominis", "Hip Flexors"],
    secondary_muscles: ["Obliques", "Transverse Abdominis", "Forearms", "Lats"],
    muscle_group: "Abs",
    equipment_id: null,
    equipment_label: "Bodyweight",
    common_mistakes: [
      "Swinging your body to gain momentum.",
      "Bending the knees too much.",
      "Using only hip flexors without engaging the core."
    ],
    safety_tips: [
      "Have a spotter or use a vertical knee raise station if new to the movement.",
      "Do not overextend lower back at the bottom."
    ],
    breathing: "Exhale as you raise your legs, inhale as you lower.",
    variations: [
      "Knee Raises",
      "Windshield Wipers",
      "Toes-to-Bar"
    ],
    alternatives: [
      "Roman Chair Leg Raises",
      "Captain's Chair Knee Raises",
      "Lying Leg Raises"
    ],
    progressions: [
      "Add a dumbbell between your feet.",
      "Perform L-sit holds."
    ],
    regressions: [
      "Perform knee raises instead of straight-leg raises.",
      "Use a vertical knee raise station with back support."
    ],
    beginner_tips: [
      "Start with knee raises and progress to straight legs.",
      "Keep your core tight to minimize swinging."
    ],
    pro_tips: [
      "Point your toes to engage the lower abs more.",
      "Pause at the top for a hard contraction."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/hanging-leg-raises.gif",
    thumbnail_url: "/images/exercises/abs.jpg",
    video_url: null,
    is_published: true,
    sort_order: 27,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000028",
    slug: "russian-twists",
    name: "Russian Twists",
    category: "Obliques",
    difficulty: "Intermediate",
    target_muscles: ["Obliques"],
    secondary_muscles: ["Rectus Abdominis", "Hip Flexors", "Lower Back"],
    muscle_group: "Obliques",
    equipment_id: null,
    equipment_label: "Bodyweight",
    common_mistakes: [
      "Rounding the lower back.",
      "Swinging the arms without engaging the core.",
      "Holding your breath."
    ],
    safety_tips: [
      "Keep your spine neutral and avoid excessive twisting.",
      "Start without weight to master the form."
    ],
    breathing: "Exhale with each twist, inhale as you return to center.",
    variations: [
      "Weighted Russian Twists",
      "Medicine Ball Russian Twists",
      "Standing Russian Twists"
    ],
    alternatives: [
      "Bicycle Crunches",
      "Side Plank Rotations",
      "Cable Woodchops"
    ],
    progressions: [
      "Hold a dumbbell or weight plate.",
      "Lift your feet higher off the ground."
    ],
    regressions: [
      "Keep your feet on the floor.",
      "Reduce the range of motion."
    ],
    beginner_tips: [
      "Keep your heels on the floor for stability.",
      "Move slowly and with control."
    ],
    pro_tips: [
      "Rotate from your ribcage, not your shoulders.",
      "Pause at each side for a deep squeeze."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/russian-twists.gif",
    thumbnail_url: "/images/exercises/core.jpg",
    video_url: null,
    is_published: true,
    sort_order: 28,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000029",
    slug: "glute-bridges",
    name: "Glute Bridges",
    category: "Glutes",
    difficulty: "Beginner",
    target_muscles: ["Gluteus Maximus"],
    secondary_muscles: ["Hamstrings", "Core", "Lower Back"],
    muscle_group: "Glutes",
    equipment_id: null,
    equipment_label: "Bodyweight",
    common_mistakes: [
      "Pushing through the balls of your feet instead of heels.",
      "Hyperextending the lower back at the top.",
      "Not squeezing the glutes at the top."
    ],
    safety_tips: [
      "Keep your neck neutral on the floor.",
      "Do not lift too high\u2014stop when hips are in line with knees."
    ],
    breathing: "Exhale as you lift, inhale as you lower.",
    variations: [
      "Single-Leg Glute Bridge",
      "Weighted Glute Bridge",
      "Elevated Feet Glute Bridge"
    ],
    alternatives: [
      "Hip Thrusts",
      "Glute Kickbacks",
      "Donkey Kicks"
    ],
    progressions: [
      "Add a barbell or dumbbell across your hips.",
      "Perform single-leg glute bridges."
    ],
    regressions: [
      "Use a smaller range of motion.",
      "Perform bridges with feet closer to glutes."
    ],
    beginner_tips: [
      "Push through your heels\u2014lift your toes slightly.",
      "Squeeze your glutes at the top for 2 seconds."
    ],
    pro_tips: [
      "Think about driving your hips through the ceiling.",
      "Pause at the top for maximum activation."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/glute-bridges.gif",
    thumbnail_url: "/images/exercises/legs.jpg",
    video_url: null,
    is_published: true,
    sort_order: 29,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "a1000000-0000-4000-8000-000000000030",
    slug: "running",
    name: "Running",
    category: "Cardio",
    difficulty: "Beginner",
    target_muscles: ["Quadriceps", "Hamstrings", "Calves"],
    secondary_muscles: ["Gluteus Maximus", "Hip Flexors", "Core", "Shoulders"],
    muscle_group: "Cardio",
    equipment_id: null,
    equipment_label: "Bodyweight",
    common_mistakes: [
      "Heel-striking heavily.",
      "Slouching or leaning too far forward.",
      "Holding tension in the shoulders and hands.",
      "Starting too fast and burning out early."
    ],
    safety_tips: [
      "Wear proper running shoes with good support.",
      "Stay hydrated and run in safe, well-lit areas.",
      "Increase distance gradually (10% rule per week)."
    ],
    breathing: "Use a 3:2 rhythm\u2014three steps inhale, two steps exhale.",
    variations: [
      "Interval Running",
      "Treadmill Running",
      "Trail Running"
    ],
    alternatives: [
      "Cycling",
      "Rowing Machine",
      "Elliptical"
    ],
    progressions: [
      "Increase distance or speed.",
      "Add sprint intervals."
    ],
    regressions: [
      "Brisk walking.",
      "Run-walk intervals (e.g., 2 min run, 1 min walk)."
    ],
    beginner_tips: [
      "Start with a run-walk program.",
      "Focus on form over speed."
    ],
    pro_tips: [
      "Maintain a cadence of around 170-180 steps per minute.",
      "Keep your hands relaxed as if holding a potato chip."
    ],
    instructions: [],
    images: [],
    primary_image_url: null,
    gif_url: "/gifs/exercises/running.gif",
    thumbnail_url: "/images/exercises/legs.jpg",
    video_url: null,
    is_published: true,
    sort_order: 30,
    created_by: null,
    updated_by: null,
    deleted_at: null,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  }
];

export function getSeedExercises(): Exercise[] {
  return EXERCISES;
}

export function getSeedExerciseBySlug(slug: string): Exercise | undefined {
  return EXERCISES.find((ex) => ex.slug === slug);
}

export function getSeedRelatedExercises(exerciseId: string): Exercise[] {
  const exercise = EXERCISES.find((ex) => ex.id === exerciseId);
  if (!exercise) return [];
  return EXERCISES.filter(
    (ex) =>
      ex.id !== exerciseId &&
      (ex.category === exercise.category ||
        ex.muscle_group === exercise.muscle_group)
  );
}

export function getSeedExerciseSteps(
  exerciseId: string
): {
  id: string;
  exercise_id: string;
  step_number: number;
  description: string;
}[] {
  const exercise = EXERCISES.find((ex) => ex.id === exerciseId);
  if (!exercise) return [];
  const instructions = INSTRUCTIONS[exercise.slug];
  if (!instructions) return [];
  return instructions.map((desc: string, i: number) => ({
    id: `${exerciseId}-step-${i + 1}`,
    exercise_id: exerciseId,
    step_number: i + 1,
    description: desc,
  }));
}

export function getSeedExercisesByEquipment(equipmentLabel: string): Exercise[] {
  if (!equipmentLabel) return [];
  const label = equipmentLabel.toLowerCase();
  return EXERCISES.filter(
    (ex) => ex.equipment_label?.toLowerCase() === label
  );
}
