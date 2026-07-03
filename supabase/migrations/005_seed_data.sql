-- ============================================================================
-- Gym56 — Seed Data
--
-- Populates the database with initial membership plans, equipment, and
-- exercises that match the existing siteData.ts content.
--
-- Run AFTER migrations 001-004 in the Supabase Dashboard SQL Editor.
-- ============================================================================

-- ── 1. Membership Plans ─────────────────────────────────────────────────────

INSERT INTO public.membership_plans (name, duration_months, currency, price_minor, savings_label, is_featured, is_active, sort_order)
VALUES
  ('1 Month', 1, 'INR', 150000, NULL, FALSE, TRUE, 0),
  ('3 Months', 3, 'INR', 400000, 'Save ₹500', FALSE, TRUE, 1),
  ('6 Months', 6, 'INR', 700000, 'Save ₹2000', TRUE, TRUE, 2),
  ('12 Months', 12, 'INR', 900000, 'Save ₹9000', FALSE, TRUE, 3)
ON CONFLICT DO NOTHING;

-- ── 2. Equipment ────────────────────────────────────────────────────────────

-- Note: created_by and updated_by are NULL because we don't have a user at seed time.
-- Admins can update these records later.

INSERT INTO public.equipment (name, slug, category, description, quantity, condition, location, is_available, is_published, sort_order)
VALUES
  (
    'Cable Crossover / Functional Trainer Tower (Dual Stack)',
    'cable-crossover-functional-trainer',
    'Machines',
    'A dual-stack cable crossover and functional trainer tower, providing constant tension for hundreds of exercise variations including chest flys, cable rows, face pulls, and tricep pushdowns.',
    1, 'excellent', 'Gym Floor', TRUE, TRUE, 0
  ),
  (
    'Lat Pulldown / Low Row Cable Tower',
    'lat-pulldown-low-row',
    'Machines',
    'Dual-function cable tower for lat pulldowns (targeting back) and low cable rows (targeting mid-back).',
    1, 'excellent', 'Gym Floor', TRUE, TRUE, 1
  ),
  (
    'Pec Deck / Rear Delt Fly Machine',
    'pec-deck-rear-delt-fly',
    'Machines',
    'Dual-use machine for pec deck (chest fly) and rear delt fly (posterior shoulder).',
    1, 'good', 'Gym Floor', TRUE, TRUE, 2
  ),
  (
    'Leg Press / Hack Squat Machine',
    'leg-press-hack-squat',
    'Machines',
    'Dual-function machine for leg press and hack squat, targeting quads, glutes, and hamstrings.',
    1, 'good', 'Gym Floor', TRUE, TRUE, 3
  ),
  (
    'Adjustable Flat-Incline Bench',
    'adjustable-flat-incline-bench',
    'Strength',
    'Versatile adjustable bench with multiple positions from flat to incline for dumbbell and barbell presses.',
    2, 'good', 'Gym Floor', TRUE, TRUE, 4
  ),
  (
    'Leg Extension / Leg Curl Machine',
    'leg-extension-leg-curl',
    'Machines',
    'Dual-use machine for leg extensions (quads) and lying leg curls (hamstrings).',
    1, 'excellent', 'Gym Floor', TRUE, TRUE, 5
  ),
  (
    'Flat Bench Press Station',
    'flat-bench-press-station',
    'Strength',
    'Sturdy flat bench press station for heavy bench pressing and other flat bench exercises.',
    1, 'excellent', 'Gym Floor', TRUE, TRUE, 6
  ),
  (
    'HKF Strength Power Rack / Squat Rack',
    'hkf-strength-power-rack',
    'Strength',
    'Heavy-duty power rack for squats, deadlifts, overhead press, and rack pulls with adjustable safety bars.',
    1, 'excellent', 'Gym Floor', TRUE, TRUE, 7
  ),
  (
    'Cardio Fitness Treadmills',
    'cardio-fitness-treadmills',
    'Cardio',
    'Multiple cardio treadmills for walking, jogging, running, and HIIT workouts with incline capability.',
    3, 'excellent', 'Gym Floor', TRUE, TRUE, 8
  ),
  (
    'Spin Bikes',
    'spin-bikes',
    'Cardio',
    'Stationary spin bikes for high-intensity cardio and endurance training.',
    3, 'good', 'Gym Floor', TRUE, TRUE, 9
  ),
  (
    'Dumbbell Rack',
    'dumbbell-rack',
    'Free Weights',
    'Organized dumbbell rack with a range of dumbbell weights for various exercises.',
    1, 'excellent', 'Gym Floor', TRUE, TRUE, 10
  ),
  (
    'Barbells',
    'barbells',
    'Free Weights',
    'Standard barbells for compound movements like squats, deadlifts, bench presses, and rows.',
    3, 'excellent', 'Gym Floor', TRUE, TRUE, 11
  ),
  (
    'EZ Curl Bar',
    'ez-curl-bar',
    'Free Weights',
    'Ergonomic EZ curl bar for bicep curls, tricep extensions, and other arm exercises to reduce wrist strain.',
    1, 'good', 'Gym Floor', TRUE, TRUE, 12
  ),
  (
    'Weight Plates',
    'weight-plates',
    'Free Weights',
    'Set of weight plates in various sizes to adjust resistance on barbells and machines.',
    1, 'excellent', 'Gym Floor', TRUE, TRUE, 13
  )
ON CONFLICT (slug) DO NOTHING;

-- ── 3. Exercises ────────────────────────────────────────────────────────────

-- Fix category constraint to include Glutes, Obliques, and Abs
ALTER TABLE public.exercises
  DROP CONSTRAINT IF EXISTS exercises_category_check;

ALTER TABLE public.exercises
  ADD CONSTRAINT exercises_category_check
  CHECK (category IN ('Chest','Back','Shoulders','Legs','Arms','Core','Cardio','Glutes','Obliques','Abs'));

-- We need to get equipment IDs for linking
DO $$
DECLARE
  cable_crossover_id UUID;
  lat_pulldown_id UUID;
  pec_deck_id UUID;
  leg_press_id UUID;
  adjustable_bench_id UUID;
  leg_extension_id UUID;
  flat_bench_id UUID;
  power_rack_id UUID;
  treadmill_id UUID;
  spin_bike_id UUID;
  dumbbell_rack_id UUID;
  barbell_id UUID;
  ez_curl_id UUID;
BEGIN
  SELECT id INTO cable_crossover_id FROM equipment WHERE slug = 'cable-crossover-functional-trainer';
  SELECT id INTO lat_pulldown_id FROM equipment WHERE slug = 'lat-pulldown-low-row';
  SELECT id INTO pec_deck_id FROM equipment WHERE slug = 'pec-deck-rear-delt-fly';
  SELECT id INTO leg_press_id FROM equipment WHERE slug = 'leg-press-hack-squat';
  SELECT id INTO adjustable_bench_id FROM equipment WHERE slug = 'adjustable-flat-incline-bench';
  SELECT id INTO leg_extension_id FROM equipment WHERE slug = 'leg-extension-leg-curl';
  SELECT id INTO flat_bench_id FROM equipment WHERE slug = 'flat-bench-press-station';
  SELECT id INTO power_rack_id FROM equipment WHERE slug = 'hkf-strength-power-rack';
  SELECT id INTO treadmill_id FROM equipment WHERE slug = 'cardio-fitness-treadmills';
  SELECT id INTO spin_bike_id FROM equipment WHERE slug = 'spin-bikes';
  SELECT id INTO dumbbell_rack_id FROM equipment WHERE slug = 'dumbbell-rack';
  SELECT id INTO barbell_id FROM equipment WHERE slug = 'barbells';
  SELECT id INTO ez_curl_id FROM equipment WHERE slug = 'ez-curl-bar';

  -- Chest Exercises
  INSERT INTO exercises (name, slug, category, muscle_group, equipment_id, equipment_label, difficulty, target_muscles, common_mistakes, safety_tips, is_published, sort_order) VALUES
    ('Flat Barbell Bench Press', 'flat-barbell-bench-press', 'Chest', 'Chest', flat_bench_id, 'Barbells, Flat Bench Press Station', 'Intermediate', ARRAY['Pectoralis Major', 'Anterior Deltoids', 'Triceps'], ARRAY['Bouncing bar off chest.', 'Flaring elbows too wide.', 'Arching back excessively.'], ARRAY['Always use a spotter for heavy sets.', 'Keep feet flat on floor.', 'Start with lighter weight to master form.'], TRUE, 0),
    ('Incline Dumbbell Press', 'incline-dumbbell-press', 'Chest', 'Upper Chest', adjustable_bench_id, 'Dumbbell Rack, Adjustable Flat-Incline Bench', 'Intermediate', ARRAY['Upper Pectoralis', 'Anterior Deltoids', 'Triceps'], ARRAY['Using too much weight.', 'Arching lower back.', 'Locking elbows at top.'], ARRAY['Start with light dumbbells.', 'Have a spotter if needed.', 'Keep wrists straight.'], TRUE, 1),
    ('Cable Chest Fly', 'cable-chest-fly', 'Chest', 'Chest', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Beginner', ARRAY['Pectoralis Major', 'Anterior Deltoids'], ARRAY['Using too much weight.', 'Locking elbows.', 'Swinging body for momentum.'], ARRAY['Keep core engaged.', 'Use controlled movements.', 'Breathe steadily.'], TRUE, 2),
    ('High Cable Fly', 'high-cable-fly', 'Chest', 'Lower Chest', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Intermediate', ARRAY['Lower Pectoralis', 'Anterior Deltoids'], ARRAY['Using too much weight.', 'Not leaning forward enough.', 'Rushing the movement.'], ARRAY['Keep knees slightly bent.', 'Maintain tension on cables.', 'Control the movement both ways.'], TRUE, 3),
    ('Low Cable Fly', 'low-cable-fly', 'Chest', 'Upper Chest', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Intermediate', ARRAY['Upper Pectoralis', 'Anterior Deltoids'], ARRAY['Using too much weight.', 'Swinging arms.', 'Not squeezing at top.'], ARRAY['Keep core braced.', 'Use slow, controlled movements.', 'Breathe properly.'], TRUE, 4),
    ('Single Arm Cable Press', 'single-arm-cable-press', 'Chest', 'Chest', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Intermediate', ARRAY['Pectoralis Major', 'Anterior Deltoids', 'Triceps'], ARRAY['Twisting torso too much.', 'Using too heavy weight.', 'Rushing movement.'], ARRAY['Keep core engaged to stabilize.', 'Use lighter weight for control.', 'Focus on mind-muscle connection.'], TRUE, 5),
    ('Pec Deck Fly', 'pec-deck-fly', 'Chest', 'Chest', pec_deck_id, 'Pec Deck / Rear Delt Fly Machine', 'Beginner', ARRAY['Pectoralis Major', 'Anterior Deltoids'], ARRAY['Using too much weight.', 'Rushing through reps.', 'Not squeezing at peak.'], ARRAY['Adjust seat before starting.', 'Keep movements controlled.', 'Breathe steadily.'], TRUE, 6),
    ('Cable Press Around', 'cable-press-around', 'Chest', 'Chest', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Advanced', ARRAY['Pectoralis Major', 'Anterior Deltoids'], ARRAY['Using too much weight.', 'Twisting excessively.', 'Rushing the movement.'], ARRAY['Start with light weight.', 'Keep knees slightly bent.', 'Maintain tension on cables.'], TRUE, 7),
    ('Close Grip Bench Press', 'close-grip-bench-press', 'Chest', 'Triceps and Chest', flat_bench_id, 'Barbells, Flat Bench Press Station', 'Intermediate', ARRAY['Triceps Brachii', 'Pectoralis Major'], ARRAY['Grip too narrow causing wrist pain.', 'Flaring elbows out.', 'Bouncing bar off chest.'], ARRAY['Use a spotter for heavy sets.', 'Start with light weight.', 'Keep wrists straight.'], TRUE, 8),

    -- Back Exercises
    ('Wide Grip Lat Pulldown', 'wide-grip-lat-pulldown', 'Back', 'Lats', lat_pulldown_id, 'Lat Pulldown / Low Row Cable Tower', 'Beginner', ARRAY['Latissimus Dorsi', 'Biceps', 'Rear Delts'], ARRAY['Using too much weight.', 'Pulling bar too low (below chest).', 'Swinging torso for momentum.'], ARRAY['Keep chest up.', 'Avoid pulling bar behind neck.', 'Control the weight up and down.'], TRUE, 10),
    ('Reverse Grip Lat Pulldown', 'reverse-grip-lat-pulldown', 'Back', 'Lats and Biceps', lat_pulldown_id, 'Lat Pulldown / Low Row Cable Tower', 'Beginner', ARRAY['Latissimus Dorsi', 'Biceps Brachii'], ARRAY['Using too much weight.', 'Swinging torso.', 'Pulling bar too low.'], ARRAY['Maintain good posture.', 'Control the movement.', 'Start with lighter weight.'], TRUE, 11),
    ('Close Grip Pulldown', 'close-grip-pulldown', 'Back', 'Mid Back', lat_pulldown_id, 'Lat Pulldown / Low Row Cable Tower', 'Beginner', ARRAY['Mid Back Muscles', 'Lats', 'Biceps'], ARRAY['Using momentum.', 'Not squeezing shoulder blades.', 'Rushing reps.'], ARRAY['Keep core engaged.', 'Use controlled movements.', 'Avoid rounding shoulders.'], TRUE, 12),
    ('V-Bar Pulldown', 'v-bar-pulldown', 'Back', 'Mid Back', lat_pulldown_id, 'Lat Pulldown / Low Row Cable Tower', 'Beginner', ARRAY['Mid Back', 'Lats', 'Rhomboids'], ARRAY['Using too much weight.', 'Swinging torso.', 'Not squeezing at bottom.'], ARRAY['Maintain proper posture.', 'Control the movement.', 'Start with lighter weight.'], TRUE, 13),
    ('Seated Cable Row', 'seated-cable-row', 'Back', 'Mid Back', lat_pulldown_id, 'Lat Pulldown / Low Row Cable Tower', 'Beginner', ARRAY['Rhomboids', 'Mid Back', 'Rear Delts', 'Biceps'], ARRAY['Using too much weight.', 'Rounding back.', 'Pulling with only arms.'], ARRAY['Keep chest up.', 'Avoid rounding lower back.', 'Initiate pull with back muscles.'], TRUE, 14),
    ('Single Arm Cable Row', 'single-arm-cable-row', 'Back', 'Mid Back', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Intermediate', ARRAY['Mid Back', 'Lats', 'Rear Delts', 'Biceps'], ARRAY['Twisting torso too much.', 'Using too heavy weight.', 'Not squeezing at top.'], ARRAY['Keep core tight.', 'Maintain stable position.', 'Control the weight.'], TRUE, 15),
    ('Chest Supported Dumbbell Row', 'chest-supported-dumbbell-row', 'Back', 'Mid Back', adjustable_bench_id, 'Dumbbell Rack, Adjustable Flat-Incline Bench', 'Beginner', ARRAY['Mid Back', 'Rear Delts', 'Biceps'], ARRAY['Using too much weight.', 'Pulling with only arms.', 'Not squeezing at top.'], ARRAY['Keep chest on bench.', 'Use controlled movements.', 'Start with lighter dumbbells.'], TRUE, 16),
    ('Barbell Row', 'barbell-row', 'Back', 'Mid Back', barbell_id, 'Barbells', 'Intermediate', ARRAY['Mid Back', 'Lats', 'Rear Delts', 'Biceps'], ARRAY['Rounding lower back.', 'Pulling with only arms.', 'Using too much weight.'], ARRAY['Keep back flat at all times.', 'Start with light weight.', 'Initiate pull with back muscles.'], TRUE, 17),
    ('Romanian Deadlift', 'romanian-deadlift', 'Back', 'Hamstrings and Glutes', barbell_id, 'Barbells', 'Intermediate', ARRAY['Hamstrings', 'Glutes', 'Erector Spinae'], ARRAY['Rounding lower back.', 'Knees too locked.', 'Going too low.'], ARRAY['Keep back flat at all times.', 'Start with light weight.', 'Focus on hip hinge, not knee bend.'], TRUE, 18),
    ('Straight Arm Cable Pulldown', 'straight-arm-cable-pulldown', 'Back', 'Lats', lat_pulldown_id, 'Lat Pulldown / Low Row Cable Tower', 'Beginner', ARRAY['Latissimus Dorsi', 'Rear Delts'], ARRAY['Bending elbows too much.', 'Using too much weight.', 'Rushing the movement.'], ARRAY['Keep arms almost straight.', 'Use controlled movements.', 'Focus on lats.'], TRUE, 19),
    ('Rack Pull', 'rack-pull', 'Back', 'Lower Back and Glutes', power_rack_id, 'HKF Strength Power Rack / Squat Rack, Barbells', 'Advanced', ARRAY['Erector Spinae', 'Glutes', 'Hamstrings'], ARRAY['Rounding lower back.', 'Using too much weight.', 'Rushing the movement.'], ARRAY['Keep back flat at all times.', 'Start with light weight.', 'Use proper form.'], TRUE, 20),

    -- Shoulder Exercises
    ('Dumbbell Shoulder Press', 'dumbbell-shoulder-press', 'Shoulders', 'Shoulders', dumbbell_rack_id, 'Dumbbell Rack, Adjustable Flat-Incline Bench', 'Intermediate', ARRAY['Anterior Deltoids', 'Lateral Deltoids', 'Triceps'], ARRAY['Using too much weight.', 'Arching lower back.', 'Locking elbows at top.'], ARRAY['Keep core tight.', 'Start with light weight.', 'Maintain controlled movement.'], TRUE, 21),
    ('Arnold Press', 'arnold-press', 'Shoulders', 'Shoulders', dumbbell_rack_id, 'Dumbbell Rack, Adjustable Flat-Incline Bench', 'Intermediate', ARRAY['Anterior Deltoids', 'Lateral Deltoids', 'Medial Deltoids', 'Triceps'], ARRAY['Using too much weight.', 'Rushing the rotation.', 'Arching lower back.'], ARRAY['Start with light dumbbells.', 'Keep core tight.', 'Focus on controlled movement.'], TRUE, 22),
    ('Cable Lateral Raise', 'cable-lateral-raise', 'Shoulders', 'Side Delts', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Beginner', ARRAY['Lateral Deltoids'], ARRAY['Using too much weight.', 'Swinging torso.', 'Bending elbows too much.'], ARRAY['Keep slight bend in elbows.', 'Use controlled movements.', 'Focus on side delts.'], TRUE, 23),
    ('Single Arm Cable Lateral Raise', 'single-arm-cable-lateral-raise', 'Shoulders', 'Side Delts', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Beginner', ARRAY['Lateral Deltoids'], ARRAY['Using too much weight.', 'Twisting torso.', 'Bending elbow too much.'], ARRAY['Keep slight bend in elbow.', 'Maintain stable torso.', 'Use controlled movement.'], TRUE, 24),
    ('Rear Delt Fly Machine', 'rear-delt-fly-machine', 'Shoulders', 'Rear Delts', pec_deck_id, 'Pec Deck / Rear Delt Fly Machine', 'Beginner', ARRAY['Posterior Deltoids', 'Rhomboids', 'Upper Back'], ARRAY['Using too much weight.', 'Rushing reps.', 'Not squeezing at peak.'], ARRAY['Adjust seat properly first.', 'Keep movements controlled.', 'Focus on rear delts.'], TRUE, 25),
    ('Face Pull', 'face-pull', 'Shoulders', 'Rear Delts', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Intermediate', ARRAY['Posterior Deltoids', 'Rotator Cuff', 'Upper Back'], ARRAY['Using too much weight.', 'Not pulling toward face.', 'Not spreading elbows.'], ARRAY['Keep core engaged.', 'Use controlled movements.', 'Focus on rear delts.'], TRUE, 26),
    ('Front Raise', 'front-raise', 'Shoulders', 'Front Delts', dumbbell_rack_id, 'Dumbbell Rack', 'Beginner', ARRAY['Anterior Deltoids'], ARRAY['Using too much weight.', 'Swinging torso.', 'Raising too high.'], ARRAY['Keep core engaged.', 'Use controlled movements.', 'Start with light weight.'], TRUE, 27),
    ('Cable Front Raise', 'cable-front-raise', 'Shoulders', 'Front Delts', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Beginner', ARRAY['Anterior Deltoids'], ARRAY['Using too much weight.', 'Swinging torso.', 'Raising too high.'], ARRAY['Keep slight bend in elbow.', 'Control the weight.', 'Focus on front delts.'], TRUE, 28),
    ('Upright Row', 'upright-row', 'Shoulders', 'Side Delts and Traps', barbell_id, 'Barbells', 'Intermediate', ARRAY['Lateral Deltoids', 'Trapezius', 'Biceps'], ARRAY['Pulling bar too high.', 'Using too much weight.', 'Rounding shoulders.'], ARRAY['Don''t pull bar above chin.', 'Keep shoulders back.', 'Start with light weight.'], TRUE, 29),

    -- Leg Exercises
    ('Barbell Squat', 'barbell-squat', 'Legs', 'Quads and Glutes', power_rack_id, 'HKF Strength Power Rack / Squat Rack, Barbells', 'Intermediate', ARRAY['Quadriceps', 'Glutes', 'Hamstrings', 'Core'], ARRAY['Knees caving in.', 'Not going deep enough.', 'Heels coming off floor.'], ARRAY['Keep chest up and back straight.', 'Use a spotter if needed.', 'Start with bodyweight or light weight.'], TRUE, 30),
    ('Hack Squat', 'hack-squat', 'Legs', 'Quads and Glutes', leg_press_id, 'Leg Press / Hack Squat Machine', 'Intermediate', ARRAY['Quadriceps', 'Glutes', 'Hamstrings'], ARRAY['Knees extending past toes too far.', 'Using too much weight.', 'Not going deep enough.'], ARRAY['Keep feet flat on platform.', 'Use safety bars when loading/unloading.', 'Start with lighter weight.'], TRUE, 31),
    ('Leg Press', 'leg-press', 'Legs', 'Quads and Glutes', leg_press_id, 'Leg Press / Hack Squat Machine', 'Beginner', ARRAY['Quadriceps', 'Glutes', 'Hamstrings'], ARRAY['Locking knees at top.', 'Using too much weight.', 'Rounding lower back.'], ARRAY['Do not lock knees at top.', 'Keep lower back pressed against pad.', 'Use safety bars when needed.'], TRUE, 32),
    ('Bulgarian Split Squat', 'bulgarian-split-squat', 'Legs', 'Quads and Glutes', adjustable_bench_id, 'Adjustable Flat-Incline Bench', 'Intermediate', ARRAY['Quadriceps', 'Glutes', 'Hamstrings'], ARRAY['Front knee extending past toes too far.', 'Not going deep enough.', 'Leaning too far forward.'], ARRAY['Keep front knee over ankle.', 'Use bodyweight first.', 'Hold on to something for balance if needed.'], TRUE, 33),
    ('Walking Lunges', 'walking-lunges', 'Legs', 'Quads and Glutes', NULL, 'Bodyweight or Dumbbell Rack', 'Intermediate', ARRAY['Quadriceps', 'Glutes', 'Hamstrings'], ARRAY['Front knee going too far past toes.', 'Not going deep enough.', 'Leaning too far forward.'], ARRAY['Keep torso upright.', 'Start with bodyweight.', 'Use controlled steps.'], TRUE, 34),
    ('Leg Extension', 'leg-extension', 'Legs', 'Quads', leg_extension_id, 'Leg Extension / Leg Curl Machine', 'Beginner', ARRAY['Quadriceps'], ARRAY['Using too much weight.', 'Locking knees at top.', 'Rushing reps.'], ARRAY['Do not lock knees at top.', 'Use controlled movements.', 'Start with light weight.'], TRUE, 35),
    ('Leg Curl', 'leg-curl', 'Legs', 'Hamstrings', leg_extension_id, 'Leg Extension / Leg Curl Machine', 'Beginner', ARRAY['Hamstrings'], ARRAY['Using too much weight.', 'Rushing reps.', 'Not squeezing at top.'], ARRAY['Use controlled movements.', 'Start with light weight.', 'Focus on hamstring contraction.'], TRUE, 36),
    ('Standing Calf Raise', 'standing-calf-raise', 'Legs', 'Calves', NULL, 'Bodyweight or HKF Strength Power Rack', 'Beginner', ARRAY['Gastrocnemius', 'Soleus'], ARRAY['Using too much momentum.', 'Not going through full range of motion.', 'Rushing reps.'], ARRAY['Use controlled movements.', 'Hold on for balance if needed.', 'Focus on full stretch and contraction.'], TRUE, 37),
    ('Seated Calf Raise using Leg Press', 'seated-calf-raise-using-leg-press', 'Legs', 'Calves', leg_press_id, 'Leg Press / Hack Squat Machine', 'Beginner', ARRAY['Soleus', 'Gastrocnemius'], ARRAY['Using too much weight.', 'Not going through full range of motion.', 'Rushing reps.'], ARRAY['Use controlled movements.', 'Focus on full stretch and contraction.', 'Start with lighter weight.'], TRUE, 38),

    -- Glutes Exercises
    ('Hip Thrust', 'hip-thrust', 'Glutes', 'Glutes', adjustable_bench_id, 'Adjustable Flat-Incline Bench, Barbells', 'Intermediate', ARRAY['Glutes', 'Hamstrings'], ARRAY['Arching lower back too much.', 'Not squeezing glutes at top.', 'Using too much weight.'], ARRAY['Use a barbell pad for comfort.', 'Keep core engaged.', 'Focus on glute contraction.'], TRUE, 39),
    ('Cable Kickback', 'cable-kickback', 'Glutes', 'Glutes', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Beginner', ARRAY['Glutes', 'Hamstrings'], ARRAY['Using too much weight.', 'Swinging leg too much.', 'Arching lower back.'], ARRAY['Keep core engaged.', 'Use controlled movements.', 'Focus on glutes.'], TRUE, 40),
    ('Sumo Squat', 'sumo-squat', 'Glutes', 'Glutes and Inner Thighs', NULL, 'Barbells or Dumbbell Rack', 'Intermediate', ARRAY['Glutes', 'Inner Thighs', 'Quadriceps', 'Hamstrings'], ARRAY['Knees caving in.', 'Not going deep enough.', 'Heels coming off floor.'], ARRAY['Keep chest up.', 'Push knees out slightly.', 'Start with light weight.'], TRUE, 41),
    ('Split Squat', 'split-squat', 'Glutes', 'Glutes and Legs', NULL, 'Bodyweight or Dumbbell Rack', 'Intermediate', ARRAY['Glutes', 'Quadriceps', 'Hamstrings'], ARRAY['Front knee going too far past toes.', 'Not going deep enough.', 'Leaning too far forward.'], ARRAY['Keep torso upright.', 'Start with bodyweight.', 'Use controlled movements.'], TRUE, 42),

    -- Arms (Biceps) Exercises
    ('Barbell Curl', 'barbell-curl', 'Arms', 'Biceps', barbell_id, 'Barbells', 'Beginner', ARRAY['Biceps Brachii', 'Brachialis', 'Brachioradialis'], ARRAY['Using too much weight.', 'Swinging torso.', 'Moving elbows away from body.'], ARRAY['Keep core engaged.', 'Use controlled movements.', 'Start with light weight.'], TRUE, 43),
    ('EZ Bar Curl', 'ez-bar-curl', 'Arms', 'Biceps', ez_curl_id, 'EZ Curl Bar', 'Beginner', ARRAY['Biceps Brachii', 'Brachialis'], ARRAY['Using too much weight.', 'Swinging torso.', 'Moving elbows.'], ARRAY['Keep core engaged.', 'Use controlled movements.', 'Start with light weight.'], TRUE, 44),
    ('Cable Curl', 'cable-curl', 'Arms', 'Biceps', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Beginner', ARRAY['Biceps Brachii', 'Brachialis'], ARRAY['Using too much weight.', 'Swinging torso.', 'Moving elbows away from body.'], ARRAY['Keep core tight.', 'Use controlled movements.', 'Maintain constant tension.'], TRUE, 45),
    ('Single Arm Cable Curl', 'single-arm-cable-curl', 'Arms', 'Biceps', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Beginner', ARRAY['Biceps Brachii', 'Brachialis'], ARRAY['Using too much weight.', 'Swinging torso.', 'Not squeezing at top.'], ARRAY['Keep core tight.', 'Use controlled movements.', 'Focus on bicep contraction.'], TRUE, 46),
    ('Hammer Curl', 'hammer-curl', 'Arms', 'Biceps and Brachialis', dumbbell_rack_id, 'Dumbbell Rack', 'Beginner', ARRAY['Brachialis', 'Biceps Brachii', 'Brachioradialis'], ARRAY['Using too much weight.', 'Swinging torso.', 'Moving elbows.'], ARRAY['Keep core engaged.', 'Use controlled movements.', 'Start with light weight.'], TRUE, 47),
    ('Concentration Curl', 'concentration-curl', 'Arms', 'Biceps', dumbbell_rack_id, 'Dumbbell Rack, Adjustable Flat-Incline Bench', 'Beginner', ARRAY['Biceps Brachii'], ARRAY['Using too much weight.', 'Moving upper arm.', 'Rushing reps.'], ARRAY['Keep upper arm stationary.', 'Use controlled movements.', 'Focus on bicep contraction.'], TRUE, 48),
    ('Preacher Style Cable Curl', 'preacher-style-cable-curl', 'Arms', 'Biceps', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower, Adjustable Flat-Incline Bench', 'Intermediate', ARRAY['Biceps Brachii'], ARRAY['Using too much weight.', 'Lifting upper arms off bench.', 'Rushing reps.'], ARRAY['Keep upper arms on bench.', 'Use controlled movements.', 'Start with light weight.'], TRUE, 49),

    -- Arms (Triceps) Exercises
    ('Cable Pushdown', 'cable-pushdown', 'Arms', 'Triceps', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Beginner', ARRAY['Triceps Brachii'], ARRAY['Using too much weight.', 'Moving elbows away from body.', 'Not fully extending arms.'], ARRAY['Keep elbows tight to body.', 'Use controlled movements.', 'Maintain constant tension.'], TRUE, 50),
    ('Overhead Cable Extension', 'overhead-cable-extension', 'Arms', 'Triceps', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Intermediate', ARRAY['Triceps Brachii (Long Head)'], ARRAY['Using too much weight.', 'Flaring elbows out.', 'Arching lower back.'], ARRAY['Keep core engaged.', 'Use controlled movements.', 'Keep elbows close to head.'], TRUE, 51),
    ('Single Arm Pushdown', 'single-arm-pushdown', 'Arms', 'Triceps', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Intermediate', ARRAY['Triceps Brachii'], ARRAY['Using too much weight.', 'Twisting torso.', 'Not fully extending arm.'], ARRAY['Keep core tight.', 'Maintain stable torso.', 'Use controlled movement.'], TRUE, 52),
    ('Rope Pushdown', 'rope-pushdown', 'Arms', 'Triceps', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Beginner', ARRAY['Triceps Brachii (Lateral Head)'], ARRAY['Using too much weight.', 'Not spreading rope at bottom.', 'Moving elbows away from body.'], ARRAY['Keep elbows tight to body.', 'Spread rope at bottom for peak contraction.', 'Use controlled movements.'], TRUE, 53),
    ('Bench Dips', 'bench-dips', 'Arms', 'Triceps', adjustable_bench_id, 'Adjustable Flat-Incline Bench', 'Beginner', ARRAY['Triceps Brachii', 'Chest'], ARRAY['Going too low (shoulder strain).', 'Leaning too far forward.', 'Not going through full range of motion.'], ARRAY['Don''t go too low if shoulders hurt.', 'Keep core engaged.', 'Bend knees to make it easier if needed.'], TRUE, 54),

    -- Abs Exercises
    ('Cable Crunch', 'cable-crunch', 'Abs', 'Abs', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Beginner', ARRAY['Rectus Abdominis'], ARRAY['Using too much weight.', 'Not crunching fully.', 'Using only arms.'], ARRAY['Focus on abs, not just pulling with arms.', 'Use controlled movements.', 'Start with light weight.'], TRUE, 55),
    ('Reverse Crunch', 'reverse-crunch', 'Abs', 'Lower Abs', NULL, 'Bodyweight', 'Beginner', ARRAY['Lower Rectus Abdominis'], ARRAY['Using momentum.', 'Lifting too high.', 'Not squeezing at top.'], ARRAY['Use controlled movements.', 'Focus on lower abs.', 'Exhale as you crunch.'], TRUE, 56),
    ('Leg Raise', 'leg-raise', 'Abs', 'Lower Abs', NULL, 'Bodyweight or HKF Strength Power Rack', 'Intermediate', ARRAY['Lower Rectus Abdominis', 'Hip Flexors'], ARRAY['Using too much momentum.', 'Swinging legs.', 'Arching lower back.'], ARRAY['Use controlled movements.', 'Keep core engaged.', 'Start with bent knees if straight legs is too hard.'], TRUE, 57),
    ('Hanging Knee Raise (using rack)', 'hanging-knee-raise', 'Abs', 'Lower Abs', power_rack_id, 'HKF Strength Power Rack / Squat Rack', 'Intermediate', ARRAY['Lower Rectus Abdominis', 'Hip Flexors'], ARRAY['Using too much momentum.', 'Swinging body.', 'Not raising knees high enough.'], ARRAY['Use controlled movements.', 'Grip bar firmly.', 'Keep core engaged.'], TRUE, 58),
    ('Russian Twist', 'russian-twist', 'Abs', 'Obliques and Abs', NULL, 'Bodyweight or Dumbbell Rack', 'Intermediate', ARRAY['Obliques', 'Rectus Abdominis'], ARRAY['Twisting too fast.', 'Not leaning back enough.', 'Using too much weight (if adding weight).'], ARRAY['Keep core engaged at all times.', 'Use controlled twists.', 'Start without weight.'], TRUE, 59),
    ('Plank', 'plank', 'Abs', 'Core', NULL, 'Bodyweight', 'Beginner', ARRAY['Rectus Abdominis', 'Transverse Abdominis', 'Obliques', 'Lower Back'], ARRAY['Letting hips sag.', 'Holding breath.', 'Holding too long (form breaks down).'], ARRAY['Keep body straight.', 'Breathe steadily.', 'Shorten time if form breaks.'], TRUE, 60),

    -- Obliques Exercises
    ('Woodchoppers', 'woodchoppers', 'Obliques', 'Obliques', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Intermediate', ARRAY['Obliques', 'Core', 'Lats'], ARRAY['Using too much weight.', 'Twisting too fast.', 'Not using core muscles.'], ARRAY['Use controlled movements.', 'Keep core engaged.', 'Focus on obliques.'], TRUE, 61),
    ('Cable Twists', 'cable-twists', 'Obliques', 'Obliques', cable_crossover_id, 'Cable Crossover / Functional Trainer Tower', 'Intermediate', ARRAY['Obliques', 'Core'], ARRAY['Using too much weight.', 'Rushing twists.', 'Not using core muscles.'], ARRAY['Keep core engaged.', 'Use controlled movements.', 'Focus on obliques.'], TRUE, 62),
    ('Side Plank', 'side-plank', 'Obliques', 'Obliques and Core', NULL, 'Bodyweight', 'Intermediate', ARRAY['Obliques', 'Transverse Abdominis', 'Shoulders'], ARRAY['Letting hips sag.', 'Not holding long enough.', 'Holding breath.'], ARRAY['Keep body in straight line.', 'Breathe steadily.', 'Start with shorter holds.'], TRUE, 63),

    -- Cardio Exercises
    ('Treadmill Walk', 'treadmill-walk', 'Cardio', 'Full Body', treadmill_id, 'Cardio Fitness Treadmills', 'Beginner', ARRAY['Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Cardiovascular System'], ARRAY['Holding on too tightly.', 'Slouching.', 'Going too fast too soon.'], ARRAY['Always use safety key.', 'Start slow.', 'Stay hydrated.'], TRUE, 64),
    ('Incline Walk', 'incline-walk', 'Cardio', 'Glutes and Legs', treadmill_id, 'Cardio Fitness Treadmills', 'Intermediate', ARRAY['Glutes', 'Quadriceps', 'Hamstrings', 'Calves', 'Cardiovascular System'], ARRAY['Incline too high too soon.', 'Holding on too tightly.', 'Slouching forward.'], ARRAY['Start with lower incline.', 'Always use safety key.', 'Stay hydrated.'], TRUE, 65),
    ('Jogging', 'jogging', 'Cardio', 'Full Body', treadmill_id, 'Cardio Fitness Treadmills', 'Intermediate', ARRAY['Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Cardiovascular System'], ARRAY['Heel striking too hard.', 'Overstriding.', 'Not warming up properly.'], ARRAY['Always use safety key.', 'Warm up first.', 'Start with shorter jogging intervals.'], TRUE, 66),
    ('Running', 'running', 'Cardio', 'Full Body', treadmill_id, 'Cardio Fitness Treadmills', 'Advanced', ARRAY['Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Cardiovascular System'], ARRAY['Overstriding.', 'Heel striking.', 'Slouching.'], ARRAY['Always use safety key.', 'Warm up and cool down.', 'Stay hydrated.'], TRUE, 67),
    ('HIIT', 'hiit', 'Cardio', 'Full Body', treadmill_id, 'Cardio Fitness Treadmills', 'Advanced', ARRAY['Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Cardiovascular System'], ARRAY['Going too hard too soon.', 'Not warming up properly.', 'Not cooling down.'], ARRAY['Always use safety key.', 'Start with fewer rounds.', 'Listen to your body.'], TRUE, 68),
    ('Spin Bike', 'spin-bike', 'Cardio', 'Legs', spin_bike_id, 'Spin Bikes', 'Beginner', ARRAY['Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Cardiovascular System'], ARRAY['Seat too high or low.', 'Knees too far forward.', 'Hunching over handlebars.'], ARRAY['Adjust bike properly before starting.', 'Start with light resistance.', 'Stay hydrated.'], TRUE, 69)
  ON CONFLICT (slug) DO NOTHING;

END $$;
