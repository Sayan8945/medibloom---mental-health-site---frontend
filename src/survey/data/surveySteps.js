// Pure data — no React. Consumed by step components and the review screen.

export const STEP_TITLES = [
  'Welcome',
  'Basic Information',
  'Lifestyle',
  'Work & Study Stress',
  'Emotional Wellbeing',
  'Anxiety Screening',
  'Depression Screening',
  'Social Wellbeing',
  'Digital Wellbeing',
  'Coping Habits',
  'Optional History',
  'Review & Submit',
];

export const TOTAL_STEPS = STEP_TITLES.length; // 12

// Shared scales
export const FREQUENCY_OPTIONS = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Often' },
  { value: 4, label: 'Almost Always' },
];

export const AGREEMENT_OPTIONS = [
  { value: 0, label: 'Strongly Disagree' },
  { value: 1, label: 'Disagree' },
  { value: 2, label: 'Neutral' },
  { value: 3, label: 'Agree' },
  { value: 4, label: 'Strongly Agree' },
];

export const GENDER_OPTIONS = [
  'Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other',
];

export const EDUCATION_OPTIONS = [
  'High School', 'Undergraduate', 'Postgraduate', 'PhD', 'Vocational / Trade', 'Other',
];

export const OCCUPATION_OPTIONS = [
  'Student', 'Employed (Full-time)', 'Employed (Part-time)', 'Self-employed',
  'Unemployed', 'Homemaker', 'Retired', 'Other',
];

export const RELATIONSHIP_OPTIONS = [
  'Single', 'In a relationship', 'Married', 'Divorced / Separated', 'Widowed', 'Prefer not to say',
];

export const SLEEP_DURATION_OPTIONS = [
  'Less than 4 hours', '4–5 hours', '6–7 hours', '7–8 hours', 'More than 8 hours',
];

export const EXERCISE_OPTIONS = [
  'Never', '1–2 times/week', '3–4 times/week', '5+ times/week', 'Daily',
];

export const DIET_OPTIONS = [
  'Very Poor', 'Poor', 'Fair', 'Good', 'Excellent',
];

export const COPING_HABITS = [
  'Meditation', 'Journaling', 'Exercise', 'Talking to friends',
  'Listening to music', 'Reading', 'Therapy / Counseling',
  'Art / Creative hobbies', 'Deep breathing', 'Nature walks',
  'Gaming', 'Prayer / Spirituality', 'Cooking', 'Other',
];

export const STRESS_QUESTIONS = [
  { id: 'workStressLevel',    label: 'My work or study life feels stressful.' },
  { id: 'deadlineStruggle',   label: 'I struggle to meet deadlines.' },
  { id: 'feelOverwhelmed',    label: 'I feel overwhelmed by my responsibilities.' },
  { id: 'enjoyWork',          label: 'I enjoy my work or studies.' },
  { id: 'experienceBurnout',  label: 'I experience burnout.' },
];

export const EMOTIONAL_QUESTIONS = [
  { id: 'moodChanges',        label: 'I experience frequent mood changes.', emoji: '🎭' },
  { id: 'motivation',         label: 'I feel motivated to pursue my goals.', emoji: '🚀' },
  { id: 'happiness',          label: 'I feel happy and content.', emoji: '😊' },
  { id: 'loneliness',         label: 'I feel lonely.', emoji: '🌧️' },
  { id: 'confidence',         label: 'I feel confident in myself.', emoji: '💪' },
  { id: 'irritability',       label: 'I feel irritable or easily frustrated.', emoji: '😤' },
  { id: 'hopefulness',        label: 'I feel hopeful about the future.', emoji: '🌅' },
  { id: 'emotionalStability', label: 'I feel emotionally stable.', emoji: '⚖️' },
];

export const ANXIETY_QUESTIONS = [
  { id: 'nervousWithoutReason', label: 'I feel nervous or anxious without a clear reason.' },
  { id: 'excessiveWorry',       label: 'I worry excessively about various things.' },
  { id: 'difficultyRelaxing',   label: 'I find it difficult to relax.' },
  { id: 'racingThoughts',       label: 'I experience racing thoughts.' },
  { id: 'avoidanceBehavior',    label: 'I avoid situations or places due to anxiety.' },
  { id: 'frequentTension',      label: 'I feel tense or on edge frequently.' },
];

export const DEPRESSION_QUESTIONS = [
  { id: 'lostInterest',         label: 'I have lost interest in activities I once enjoyed.' },
  { id: 'fatigue',              label: 'I feel tired or have low energy most of the day.' },
  { id: 'concentrationIssues',  label: 'I struggle to concentrate or make decisions.' },
  { id: 'feelHopeless',         label: 'I feel hopeless about my situation.' },
  { id: 'feelWorthless',        label: 'I feel worthless or like a burden to others.' },
  { id: 'difficultyGettingUp',  label: 'I have difficulty getting out of bed in the morning.' },
  { id: 'emotionallyNumb',      label: 'I feel emotionally numb or empty.' },
];

export const SOCIAL_QUESTIONS = [
  { id: 'familySupport',         label: 'I feel supported by my family.' },
  { id: 'friendSupport',         label: 'I feel supported by my friends.' },
  { id: 'socialInteraction',     label: 'I interact socially with others regularly.' },
  { id: 'expressEmotions',       label: 'I feel comfortable expressing my emotions.' },
  { id: 'senseOfBelonging',      label: 'I have a strong sense of belonging.' },
  { id: 'communityInvolvement',  label: 'I am involved in community or group activities.' },
];

export const DIGITAL_QUESTIONS = [
  { id: 'socialMediaUsage',      label: 'I spend excessive time on social media.' },
  { id: 'screenTimeBeforeBed',   label: 'I use screens (phone/tablet) right before sleeping.' },
  { id: 'onlineStress',          label: 'Online interactions cause me stress or anxiety.' },
  { id: 'gamingHabits',          label: 'Gaming takes up a significant part of my day.' },
];
