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
};
