export const categories = ['Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core', 'Cardio'] as const;

export type Category = typeof categories[number];

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  category: Category;
  muscleGroup: string;
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  targetMuscles: string[];
  instructions: string[];
  commonMistakes: string[];
  safetyTips: string[];
  relatedExercises: string[];
}

export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Chest Press',
    slug: 'chest-press',
    category: 'Chest',
    muscleGroup: 'Chest',
    equipment: 'Barbell, Bench',
    difficulty: 'Beginner',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoid', 'Triceps Brachii'],
    instructions: [
      'Lie flat on the bench with your feet firmly on the ground.',
      'Grip the barbell slightly wider than shoulder-width apart.',
      'Lower the bar slowly to your chest, keeping your elbows at a 45-degree angle.',
      'Push the bar back up to the starting position, exhaling as you push.',
      'Repeat for the desired number of repetitions.'
    ],
    commonMistakes: [
      'Bouncing the bar off your chest.',
      'Flaring your elbows out too much.',
      'Not keeping your feet flat on the ground.'
    ],
    safetyTips: [
      'Always use a spotter when lifting heavy weights.',
      'Start with a light weight to master the form.',
      'Keep your core engaged throughout the movement.'
    ],
    relatedExercises: ['incline-chest-press', 'decline-chest-press', 'dumbbell-fly']
  },
  {
    id: '2',
    name: 'Pull-Up',
    slug: 'pull-up',
    category: 'Back',
    muscleGroup: 'Lats',
    equipment: 'Pull-Up Bar',
    difficulty: 'Intermediate',
    targetMuscles: ['Latissimus Dorsi', 'Biceps Brachii', 'Rhomboids', 'Trapezius'],
    instructions: [
      'Grip the pull-up bar with your palms facing away from you, slightly wider than shoulder-width.',
      'Hang with your arms fully extended.',
      'Pull your body up until your chin is above the bar.',
      'Lower yourself back down slowly to the starting position.',
      'Repeat.'
    ],
    commonMistakes: [
      'Using momentum to swing your body.',
      'Not pulling your chest all the way up to the bar.',
      'Letting your shoulders hunch up to your ears.'
    ],
    safetyTips: [
      'Use an assisted pull-up machine or resistance band if you can\'t do full pull-ups yet.',
      'Engage your lats at the start of the movement.',
      'Start with assisted reps and gradually progress.'
    ],
    relatedExercises: ['lat-pulldown', 'bent-over-row', 'chin-up']
  },
  {
    id: '3',
    name: 'Overhead Press',
    slug: 'overhead-press',
    category: 'Shoulders',
    muscleGroup: 'Shoulders',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    targetMuscles: ['Deltoids', 'Triceps', 'Upper Chest', 'Trapezius'],
    instructions: [
      'Stand with your feet shoulder-width apart, holding the barbell at shoulder height.',
      'Press the bar straight up over your head until your arms are fully extended.',
      'Lower the bar slowly back to the starting position.',
      'Repeat.'
    ],
    commonMistakes: [
      'Arching your back too much.',
      'Pressing the bar in front of your face instead of over your head.',
      'Using too much leg drive.'
    ],
    safetyTips: [
      'Keep your core braced to protect your lower back.',
      'Start with a light weight to perfect your form.',
      'Don\'t lock your elbows completely at the top.'
    ],
    relatedExercises: ['dumbbell-shoulder-press', 'lateral-raise', 'front-raise']
  },
  {
    id: '4',
    name: 'Squat',
    slug: 'squat',
    category: 'Legs',
    muscleGroup: 'Quads',
    equipment: 'Barbell',
    difficulty: 'Beginner',
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
    instructions: [
      'Stand with your feet slightly wider than shoulder-width apart, toes turned out.',
      'Rest the barbell on your upper back (not your neck!).',
      'Lower your hips back and down as if sitting into a chair.',
      'Lower until your thighs are at least parallel to the floor.',
      'Push through your heels to stand back up to the starting position.',
      'Repeat.'
    ],
    commonMistakes: [
      'Knees caving inward.',
      'Not going deep enough.',
      'Heels coming off the floor.'
    ],
    safetyTips: [
      'Keep your chest up and your back straight.',
      'Start with bodyweight squats to master the form.',
      'Use a spotter if you\'re lifting heavy.'
    ],
    relatedExercises: ['leg-press', 'deadlift', 'lunges']
  },
  {
    id: '5',
    name: 'Bicep Curl',
    slug: 'bicep-curl',
    category: 'Arms',
    muscleGroup: 'Biceps',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    targetMuscles: ['Biceps Brachii', 'Brachialis', 'Brachioradialis'],
    instructions: [
      'Stand with your feet shoulder-width apart, holding a dumbbell in each hand at your sides.',
      'Keep your upper arms stationary, palms facing forward.',
      'Curl the weights up to shoulder level, exhaling as you lift.',
      'Lower the weights slowly back to the starting position.',
      'Repeat.'
    ],
    commonMistakes: [
      'Swinging your body to lift the weights.',
      'Bringing the elbows too far forward.',
      'Not going through the full range of motion.'
    ],
    safetyTips: [
      'Start with light weights to focus on form.',
      'Keep your core braced throughout.',
      'Don\'t use momentum to cheat the movement.'
    ],
    relatedExercises: ['hammer-curl', 'preacher-curl', 'tricep-dip']
  },
  {
    id: '6',
    name: 'Plank',
    slug: 'plank',
    category: 'Core',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    targetMuscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Obliques', 'Lower Back'],
    instructions: [
      'Start in a push-up position with your forearms on the ground.',
      'Your elbows should be directly under your shoulders.',
      'Keep your body in a straight line from your head to your heels.',
      'Engage your core muscles.',
      'Hold the position for the desired amount of time.'
    ],
    commonMistakes: [
      'Letting your hips sag or rise too high.',
      'Holding your breath.',
      'Looking up instead of keeping your head in a neutral position.'
    ],
    safetyTips: [
      'Focus on keeping your body straight and core tight.',
      'If your back starts to hurt, shorten the duration of the hold.',
      'Breathe steadily throughout the exercise.'
    ],
    relatedExercises: ['dead-bug', 'russian-twist', 'leg-raise']
  },
  {
    id: '7',
    name: 'Treadmill Run',
    slug: 'treadmill-run',
    category: 'Cardio',
    muscleGroup: 'Full Body',
    equipment: 'Treadmill',
    difficulty: 'Beginner',
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Core'],
    instructions: [
      'Start by getting on the treadmill with the belt stopped.',
      'Set the speed to a comfortable walking pace first.',
      'Gradually increase the speed to your desired running pace.',
      'Maintain an upright posture while running.',
      'To stop, gradually decrease the speed back down to walking before stepping off.'
    ],
    commonMistakes: [
      'Holding onto the handrails too much.',
      'Overstriding.',
      'Not warming up first.'
    ],
    safetyTips: [
      'Always use the safety key.',
      'Start slow and warm up properly.',
      'Stay hydrated.'
    ],
    relatedExercises: ['elliptical', 'rowing', 'jumping-jacks']
  }
];

// ─── Equipment Data ──────────────────────────────────────────────────────────

export interface EquipmentItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  howToUse: string[];
  safetyTips: string[];
  location: string;
  quantity: number;
  condition: string;
  isAvailable: boolean;
  exercisesUsing: string[];
  relatedEquipment: string[];
}

export const equipmentList: EquipmentItem[] = [
  {
    id: 'e1',
    name: 'Treadmill Pro 3000',
    slug: 'treadmill-pro-3000',
    category: 'Cardio',
    description: 'The Treadmill Pro 3000 is our flagship cardio machine, designed for runners of all levels. Featuring a powerful motor, cushioned deck for joint protection, and intuitive controls, it provides an exceptional indoor running experience. With preset workout programs and incline capability, you can simulate outdoor terrain and track your progress in real time.',
    howToUse: [
      'Start by stepping onto the side rails and attach the safety key to your clothing.',
      'Press the start button and begin walking at a slow pace to warm up.',
      'Gradually increase speed to your desired running or walking pace using the controls.',
      'Use the incline buttons to add resistance and simulate uphill terrain.',
      'To stop, gradually reduce speed to a walking pace before stepping off the belt.',
      'Always cool down by walking at a slow pace for 2-3 minutes.'
    ],
    safetyTips: [
      'Always use the safety key clip — it stops the belt automatically if you fall.',
      'Never step onto or off a moving belt.',
      'Keep your posture upright and avoid leaning on the handrails.',
      'Start with a warm-up and end with a cool-down every session.',
      'Stay hydrated — keep a water bottle in the designated holder.'
    ],
    location: 'Ground Floor',
    quantity: 4,
    condition: 'excellent',
    isAvailable: true,
    exercisesUsing: ['treadmill-run'],
    relatedEquipment: ['elliptical-trainer', 'rowing-machine']
  },
  {
    id: 'e2',
    name: 'Olympic Barbell Set',
    slug: 'olympic-barbell-set',
    category: 'Free Weights',
    description: 'Our Olympic Barbell Sets are the foundation of strength training at Gym 56. The 20kg men\'s and 15kg women\'s bars feature rotating sleeves for smooth lifting, with knurling for a secure grip. Paired with bumper plates ranging from 2.5kg to 25kg, these sets are perfect for compound lifts like squats, deadlifts, and bench press.',
    howToUse: [
      'Load the barbell evenly with weight plates on both sides, secured with collars.',
      'Position yourself correctly for your chosen lift (squat, bench, deadlift, etc.).',
      'Maintain a tight grip and engage your core before lifting.',
      'Use smooth, controlled motions — never jerk or bounce the weight.',
      'Unload the bar evenly after your set and return plates to the rack.'
    ],
    safetyTips: [
      'Always use collars to secure weight plates.',
      'Use a spotter for heavy bench press and squat sets.',
      'Start with lighter weight to practice form before loading heavier.',
      'Never drop the barbell from height — control it down.',
      'Inspect the bar for any damage or bending before use.'
    ],
    location: 'Ground Floor',
    quantity: 6,
    condition: 'good',
    isAvailable: true,
    exercisesUsing: ['chest-press', 'squat', 'deadlift', 'overhead-press'],
    relatedEquipment: ['dumbbell-rack', 'smith-machine']
  },
  {
    id: 'e3',
    name: 'Cable Crossover Machine',
    slug: 'cable-crossover-machine',
    category: 'Machines',
    description: 'The Cable Crossover Machine is a versatile workout station that allows for hundreds of exercise variations. Dual adjustable pulleys provide constant tension throughout the entire range of motion, targeting muscles more effectively than free weights. Ideal for chest flyes, tricep pushdowns, face pulls, and woodchoppers.',
    howToUse: [
      'Adjust the pulley heights to your desired position for the exercise.',
      'Select the appropriate handle attachment (rope, straight bar, D-handle, etc.).',
      'Stand in the center position, feet shoulder-width apart.',
      'Pull the cables with controlled motion, squeezing at the peak contraction.',
      'Slowly return to starting position, maintaining tension throughout.'
    ],
    safetyTips: [
      'Check that the carabiners are securely locked before each exercise.',
      'Start with lighter weight to master the movement pattern.',
      'Keep your core engaged and avoid excessive swinging.',
      'Do not release the handles abruptly — control the weight down.',
      'Inspect cables regularly for fraying or wear.'
    ],
    location: 'Ground Floor',
    quantity: 2,
    condition: 'good',
    isAvailable: true,
    exercisesUsing: ['chest-press', 'bicep-curl'],
    relatedEquipment: ['smith-machine', 'lat-pulldown']
  },
  {
    id: 'e4',
    name: 'Rowing Machine',
    slug: 'rowing-machine',
    category: 'Cardio',
    description: 'Our Concept2-style Rowing Machine delivers a full-body, low-impact cardio workout. Engaging approximately 86% of your muscles with every stroke — legs, core, back, and arms — it is one of the most efficient exercise machines available. The air resistance system adjusts naturally to your effort level.',
    howToUse: [
      'Sit on the seat and strap your feet securely into the foot pedals.',
      'Grip the handle with an overhand grip, arms extended.',
      'Drive through your legs first, then lean back slightly and pull the handle to your lower chest.',
      'Reverse the motion: extend arms forward, lean forward, then slide forward on the seat.',
      'Maintain a 1:2 ratio — drive hard for 1 count, recover for 2 counts.'
    ],
    safetyTips: [
      'Start with light resistance to focus on proper technique — the legs do most of the work.',
      'Keep your back straight throughout the movement to avoid strain.',
      'Do not use the damper setting above 5-6 for endurance workouts.',
      'Stay hydrated during longer rowing sessions.',
      'Stop immediately if you feel any sharp pain in your lower back.'
    ],
    location: 'Ground Floor',
    quantity: 2,
    condition: 'fair',
    isAvailable: true,
    exercisesUsing: ['treadmill-run'],
    relatedEquipment: ['treadmill-pro-3000', 'elliptical-trainer']
  },
  {
    id: 'e5',
    name: 'Incline Bench',
    slug: 'incline-bench',
    category: 'Strength',
    description: 'The adjustable Incline Bench is essential for targeting the upper chest and shoulders. With multiple angle settings from flat to 90 degrees, it supports a wide variety of exercises including incline press, dumbbell flyes, seated shoulder press, and core work.',
    howToUse: [
      'Adjust the backrest to your desired angle using the locking pin.',
      'For incline press: set to 30-45 degrees to target the upper chest.',
      'Lie back with your feet flat on the floor for stability.',
      'Perform your chosen exercise with controlled form.',
      'After your set, rack the weight and sit up carefully.'
    ],
    safetyTips: [
      'Ensure the locking pin is fully engaged before placing any weight on the bench.',
      'Always use a spotter when benching heavy weights.',
      'Check the bench stability before starting your set.',
      'Do not arch your back excessively — maintain natural spine alignment.',
      'Start with dumbbells if you are new to incline pressing.'
    ],
    location: 'Ground Floor',
    quantity: 3,
    condition: 'good',
    isAvailable: true,
    exercisesUsing: ['chest-press', 'overhead-press'],
    relatedEquipment: ['olympic-barbell-set', 'dumbbell-rack']
  },
  {
    id: 'e6',
    name: 'Dumbbell Rack (5–50kg)',
    slug: 'dumbbell-rack',
    category: 'Free Weights',
    description: 'Our comprehensive Dumbbell Rack spans from 5kg to 50kg in 2.5kg increments, providing the perfect weight for every exercise and every fitness level. The rubber hex dumbbells are durable, floor-friendly, and feature ergonomic handles for comfortable gripping during long sessions.',
    howToUse: [
      'Select the appropriate weight for your exercise — you should be able to complete your target reps with good form.',
      'Lift the dumbbells from the rack using your legs, keeping your back straight.',
      'Perform your exercise with controlled, full-range movements.',
      'Set the dumbbells down gently on the rack or floor — do not drop them.',
      'Return dumbbells to their correct position on the rack when finished.'
    ],
    safetyTips: [
      'Start lighter than you think — proper form is more important than heavy weight.',
      'Use a mirror to check your form during exercises.',
      'Never throw or drop the dumbbells from height.',
      'Keep a spotter nearby for heavy dumbbell presses.',
      'Warm up your target muscles with lighter weight before going heavy.'
    ],
    location: 'Ground Floor',
    quantity: 1,
    condition: 'excellent',
    isAvailable: true,
    exercisesUsing: ['bicep-curl', 'overhead-press', 'chest-press'],
    relatedEquipment: ['olympic-barbell-set', 'kettlebell-set']
  },
  {
    id: 'e7',
    name: 'Pull-Up Station',
    slug: 'pull-up-station',
    category: 'Functional',
    description: 'The Pull-Up Station is a multi-grip training station designed for upper body pulling strength. With wide, medium, neutral, and chin-up grip positions, it targets the lats, biceps, and back from every angle. The sturdy frame also supports hanging leg raises for core work.',
    howToUse: [
      'Jump up or step onto the platform to reach the bars.',
      'Grip the bar with your chosen grip width (wide, medium, neutral).',
      'Hang with arms fully extended and engage your shoulder blades.',
      'Pull yourself up until your chin clears the bar, exhaling as you pull.',
      'Lower yourself down with control to full arm extension.'
    ],
    safetyTips: [
      'If you cannot do a full pull-up, use resistance bands or an assisted machine.',
      'Do not kip or use momentum excessively — controlled reps are more effective.',
      'Avoid letting go and dropping from the bar — step down carefully.',
      'Warm up your shoulders with arm circles and band pull-aparts first.',
      'Stop if you feel any shoulder or elbow pain.'
    ],
    location: 'Terrace',
    quantity: 2,
    condition: 'good',
    isAvailable: true,
    exercisesUsing: ['pull-up'],
    relatedEquipment: ['cable-crossover-machine', 'dumbbell-rack']
  },
  {
    id: 'e8',
    name: 'Leg Press Machine',
    slug: 'leg-press-machine',
    category: 'Machines',
    description: 'The Leg Press Machine targets your quadriceps, hamstrings, and glutes through a seated pressing motion. With an adjustable backrest and angle settings, it accommodates users of all sizes. The plate-loaded design allows for progressive overload to build lower body strength safely.',
    howToUse: [
      'Adjust the seat and backrest to a comfortable position.',
      'Place your feet shoulder-width apart on the platform.',
      'Release the safety handles and slowly lower the platform by bending your knees.',
      'Lower until your knees are at approximately 90 degrees — do not go past comfort.',
      'Press through your heels to return to the starting position without locking your knees.'
    ],
    safetyTips: [
      'Never fully lock your knees at the top of the movement.',
      'Keep your feet flat on the platform — do not lift your heels.',
      'Use the safety stops when loading and unloading plates.',
      'Start with light weight to establish proper form.',
      'Keep your lower back pressed against the pad throughout.'
    ],
    location: 'Ground Floor',
    quantity: 1,
    condition: 'maintenance',
    isAvailable: false,
    exercisesUsing: ['squat'],
    relatedEquipment: ['olympic-barbell-set', 'smith-machine']
  },
  {
    id: 'e9',
    name: 'Elliptical Trainer',
    slug: 'elliptical-trainer',
    category: 'Cardio',
    description: 'Our Elliptical Trainer provides a zero-impact cardio workout that is easy on the joints while still delivering an excellent cardiovascular challenge. The smooth stride motion engages both upper and lower body simultaneously. With adjustable resistance and pre-programmed workouts, it is perfect for warm-ups, active recovery, and dedicated cardio sessions.',
    howToUse: [
      'Step onto the pedals carefully, holding the stationary handles for balance.',
      'Begin moving your legs in a smooth, elliptical motion.',
      'Engage the moving handlebars to involve your upper body.',
      'Adjust resistance using the console controls to increase or decrease intensity.',
      'To stop, gradually reduce your speed and resistance level.'
    ],
    safetyTips: [
      'Always start at a low resistance to warm up properly.',
      'Maintain an upright posture — do not hunch over the console.',
      'Use the stationary handles when stepping on and off.',
      'Keep the moving pedals under control at all times.',
      'Wear proper athletic shoes with good grip.'
    ],
    location: 'Ground Floor',
    quantity: 3,
    condition: 'good',
    isAvailable: true,
    exercisesUsing: ['treadmill-run'],
    relatedEquipment: ['treadmill-pro-3000', 'rowing-machine']
  },
  {
    id: 'e10',
    name: 'Kettlebell Set',
    slug: 'kettlebell-set',
    category: 'Free Weights',
    description: 'Our Kettlebell Set includes weights from 8kg to 32kg, featuring cast iron construction with a flat base and wide, comfortable handle. Kettlebells are excellent for dynamic movements like swings, snatches, and Turkish get-ups that build explosive power, endurance, and mobility simultaneously.',
    howToUse: [
      'Select the appropriate kettlebell weight for your exercise.',
      'Grip the handle firmly with one or two hands depending on the movement.',
      'For kettlebell swings: hinge at your hips, hike the bell between your legs, then explode forward to chest height.',
      'Control the kettlebell on the descent and immediately begin the next rep.',
      'Set the bell down gently between sets — never drop it.'
    ],
    safetyTips: [
      'Maintain a tight core throughout all kettlebell movements.',
      'Keep your wrist straight — do not bend it under load.',
      'Start with a light weight (8-12kg) to master the swing technique.',
      'Ensure at least 1-2 metres of clearance around you during swings.',
      'Do not use kettlebells if you have lower back issues without consulting a trainer.'
    ],
    location: 'Terrace',
    quantity: 1,
    condition: 'excellent',
    isAvailable: true,
    exercisesUsing: ['squat', 'plank'],
    relatedEquipment: ['dumbbell-rack', 'foam-roller-station']
  },
  {
    id: 'e11',
    name: 'Foam Roller Station',
    slug: 'foam-roller-station',
    category: 'Recovery',
    description: 'The Foam Roller Station is dedicated to self-myofascial release and recovery. Equipped with high-density foam rollers, massage balls, and stretching mats, it is the perfect spot for pre-workout warm-ups, post-workout recovery, and mobility work to keep your muscles healthy and flexible.',
    howToUse: [
      'Choose the appropriate roller density for your comfort level.',
      'Position the roller under the muscle group you want to target (e.g., quads, back, glutes).',
      'Slowly roll over the muscle, pausing at any tight or tender spots.',
      'Breathe deeply and relax into the pressure — do not tense up.',
      'Spend 30-60 seconds per muscle group.'
    ],
    safetyTips: [
      'Never roll directly over bones or joints — only muscle tissue.',
      'Avoid rolling your lower back — stick to the upper back and glutes.',
      'Drink water after foam rolling to help flush out released toxins.',
      'Start with a soft roller if you are new to foam rolling.',
      'Stop if you feel sharp pain — foam rolling should feel like \"good pain,\" not injury pain.'
    ],
    location: 'Terrace',
    quantity: 5,
    condition: 'good',
    isAvailable: true,
    exercisesUsing: ['plank'],
    relatedEquipment: ['kettlebell-set', 'pull-up-station']
  },
  {
    id: 'e12',
    name: 'Smith Machine',
    slug: 'smith-machine',
    category: 'Machines',
    description: 'The Smith Machine offers guided barbell movement along a fixed vertical plane, providing added safety and stability for compound lifts. Perfect for beginners learning squat and bench press technique, as well as advanced lifters pushing near-maximal loads without a spotter. The safety catches can be set at any height.',
    howToUse: [
      'Adjust the bar height and safety catches to your appropriate level.',
      'Load the barbell with weight plates on the designated pegs.',
      'Position yourself under the bar, unrack by rotating the bar forward.',
      'Perform your exercise (squat, press, etc.) with the bar sliding along the guide rails.',
      'To rerack, rotate the bar backward until it catches on the hooks.'
    ],
    safetyTips: [
      'Always set the safety catches at an appropriate height before loading weight.',
      'Test the safety catches with a light unloaded rep first.',
      'Do not use the Smith Machine exclusively — incorporate free weight training too.',
      'Keep your hands positioned evenly on the bar.',
      'Never place your hands between the bar and the safety catches.'
    ],
    location: 'Ground Floor',
    quantity: 1,
    condition: 'good',
    isAvailable: true,
    exercisesUsing: ['squat', 'chest-press'],
    relatedEquipment: ['olympic-barbell-set', 'incline-bench']
  }
];

export const equipmentCategories = [
  'All',
  'Cardio',
  'Strength',
  'Free Weights',
  'Machines',
  'Functional',
  'Recovery',
] as const;

export type EquipmentCategory = typeof equipmentCategories[number];

export const siteData = {
  trustedSection: {
    title: "Trusted by the Community",
    cards: [
      {
        icon: "⭐",
        title: "Google Rating",
        value: 5.0,
        subtitle: "Based on Google Reviews",
        suffix: "",
      },
      {
        icon: "💬",
        title: "Google Reviews",
        value: 16,
        subtitle: "Happy Members",
        suffix: "+",
      },
      {
        icon: "🏋️",
        title: "Premium Facilities",
        value: 8,
        subtitle: [
          "Modern Equipment",
          "Fully Air Conditioned",
          "Water Cooler",
          "Washroom",
          "Terrace Warm-up Area",
          "Friendly Trainers",
          "Clean Environment",
          "Positive Community",
        ],
        suffix: "+",
      },
      {
        icon: "📍",
        title: "Location",
        value: "Sector 26",
        subtitle: "Gandhinagar, Gujarat",
        suffix: "",
      },
    ],
    cta: {
      text: "Read Google Reviews",
      link: "https://www.google.com",
    },
  },
  exercises,
  categories,
  equipmentList,
  equipmentCategories,
};
