import { useState, useCallback } from 'react';
import { TOTAL_STEPS } from '../data/surveySteps';

const STORAGE_KEY = 'medibloom_survey_progress';

const DEFAULT_ANSWERS = {
  basicInfo: {
    age: '', gender: '', occupation: '', education: '',
    relationshipStatus: '', country: '', city: '',
  },
  lifestyle: {
    sleepDuration: '', sleepQuality: 3, exerciseFrequency: '',
    waterIntake: 6, dietQuality: '', screenTimeHours: 4,
    outdoorActivity: 2, hasHobbies: null, consistentRoutine: null,
  },
  stress: {
    workStressLevel: null, deadlineStruggle: null, feelOverwhelmed: null,
    enjoyWork: null, experienceBurnout: null,
  },
  emotional: {
    moodChanges: null, motivation: null, happiness: null,
    loneliness: null, confidence: null, irritability: null,
    hopefulness: null, emotionalStability: null,
  },
  anxiety: {
    nervousWithoutReason: null, excessiveWorry: null, difficultyRelaxing: null,
    racingThoughts: null, avoidanceBehavior: null, frequentTension: null,
  },
  depression: {
    lostInterest: null, fatigue: null, concentrationIssues: null,
    feelHopeless: null, feelWorthless: null, difficultyGettingUp: null,
    emotionallyNumb: null,
  },
  social: {
    familySupport: null, friendSupport: null, socialInteraction: null,
    expressEmotions: null, senseOfBelonging: null, communityInvolvement: null,
  },
  digital: {
    socialMediaUsage: null, screenTimeBeforeBed: null,
    onlineStress: null, gamingHabits: null,
    cyberbullyingExperience: 'prefer_not',
  },
  coping: {
    selectedHabits: [],
    otherHabits: '',
  },
  history: {
    previousTherapy: null, diagnosisHistory: 'prefer_not',
    currentMedication: 'prefer_not', familyHistory: null,
  },
  consent: false,
};

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

export function useSurvey() {
  const saved = loadSaved();

  const [step, setStep]       = useState(saved?.step ?? 0);
  const [answers, setAnswers] = useState(saved?.answers ?? DEFAULT_ANSWERS);
  const [submitted, setSubmitted] = useState(false);

  // Deep-merge a section's partial update into answers and persist
  const updateAnswers = useCallback((section, partial) => {
    setAnswers((prev) => {
      const next = {
        ...prev,
        [section]: { ...prev[section], ...partial },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers: next }));
      } catch (_) {}
      return next;
    });
  }, [step]);

  const goNext = useCallback(() => {
    setStep((s) => {
      const next = Math.min(s + 1, TOTAL_STEPS - 1);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ step: next, answers }));
      } catch (_) {}
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [answers]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToStep = useCallback((n) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStep(0);
    setAnswers(DEFAULT_ANSWERS);
    setSubmitted(false);
  }, []);

  const submit = useCallback(async () => {
    const payload = {
      submittedAt: new Date().toISOString(),
      ...answers,
    };
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/survey`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (_) {
      // Backend optional at this stage — continue to results
    }
    localStorage.removeItem(STORAGE_KEY);
    setSubmitted(true);
  }, [answers]);

  const progress = Math.round((step / (TOTAL_STEPS - 1)) * 100);

  return {
    step, answers, submitted, progress,
    updateAnswers, goNext, goBack, goToStep, reset, submit,
  };
}
