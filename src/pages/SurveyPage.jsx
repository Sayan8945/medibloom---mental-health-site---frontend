import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurvey } from '../survey/hooks/useSurvey';
import SurveyLayout from '../survey/components/SurveyLayout';
import StepWelcome    from '../survey/components/StepWelcome';
import StepBasicInfo  from '../survey/components/StepBasicInfo';
import StepLifestyle  from '../survey/components/StepLifestyle';
import StepStress     from '../survey/components/StepStress';
import StepEmotional  from '../survey/components/StepEmotional';
import StepAnxiety    from '../survey/components/StepAnxiety';
import StepDepression from '../survey/components/StepDepression';
import StepSocial     from '../survey/components/StepSocial';
import StepDigital    from '../survey/components/StepDigital';
import StepCoping     from '../survey/components/StepCoping';
import StepHistory    from '../survey/components/StepHistory';
import StepReview     from '../survey/components/StepReview';
import StepResults    from '../survey/components/StepResults';

// Simple AI-style loading screen shown between submit and results
const AnalyzingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#f5f3ff] flex items-center justify-center font-primary px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 max-w-xs"
    >
      {/* Pulsing orb */}
      <div className="relative w-24 h-24 mx-auto">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full bg-primary"
            animate={{ scale: [1, 1.6 + i * 0.3], opacity: [0.4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
          />
        ))}
        <div className="absolute inset-0 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white text-3xl">🧠</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-title font-bold text-heroBg">Analysing Your Responses</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          Our AI is generating your personalised wellness report…
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  </div>
);

const SurveyPage = () => {
  const {
    step, answers, submitted, progress,
    updateAnswers, goNext, goBack, goToStep, reset, submit,
  } = useSurvey();

  const [isAnalyzing, setIsAnalyzing]   = useState(false);
  const [showResults, setShowResults]   = useState(submitted);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Each step handler saves its section and advances
  const advance = (section, data) => {
    updateAnswers(section, data);
    goNext();
  };

  const handleSubmit = async (consentData) => {
    setIsSubmitting(true);
    updateAnswers('consent', consentData.consent);
    await submit();
    setIsSubmitting(false);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  // Show analyzing animation
  if (isAnalyzing) return <AnalyzingScreen />;

  // Show results
  if (showResults) {
    return (
      <SurveyLayout step={12} progress={100} onBack={() => {}}>
        <StepResults answers={answers} onReset={reset} />
      </SurveyLayout>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepWelcome onStart={goNext} />;
      case 1:
        return (
          <StepBasicInfo
            data={answers.basicInfo}
            onNext={(d) => advance('basicInfo', d)}
            onBack={goBack}
          />
        );
      case 2:
        return (
          <StepLifestyle
            data={answers.lifestyle}
            onNext={(d) => advance('lifestyle', d)}
            onBack={goBack}
          />
        );
      case 3:
        return (
          <StepStress
            data={answers.stress}
            onNext={(d) => advance('stress', d)}
            onBack={goBack}
          />
        );
      case 4:
        return (
          <StepEmotional
            data={answers.emotional}
            onNext={(d) => advance('emotional', d)}
            onBack={goBack}
          />
        );
      case 5:
        return (
          <StepAnxiety
            data={answers.anxiety}
            onNext={(d) => advance('anxiety', d)}
            onBack={goBack}
          />
        );
      case 6:
        return (
          <StepDepression
            data={answers.depression}
            onNext={(d) => advance('depression', d)}
            onBack={goBack}
          />
        );
      case 7:
        return (
          <StepSocial
            data={answers.social}
            onNext={(d) => advance('social', d)}
            onBack={goBack}
          />
        );
      case 8:
        return (
          <StepDigital
            data={answers.digital}
            onNext={(d) => advance('digital', d)}
            onBack={goBack}
          />
        );
      case 9:
        return (
          <StepCoping
            data={answers.coping}
            onNext={(d) => advance('coping', d)}
            onBack={goBack}
          />
        );
      case 10:
        return (
          <StepHistory
            data={answers.history}
            onNext={(d) => advance('history', d)}
            onBack={goBack}
          />
        );
      case 11:
        return (
          <StepReview
            answers={answers}
            onSubmit={handleSubmit}
            onBack={goBack}
            onEdit={goToStep}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SurveyLayout step={step} progress={progress} onBack={goBack}>
      <AnimatePresence mode="wait">
        <motion.div key={step}>
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </SurveyLayout>
  );
};

export default SurveyPage;
