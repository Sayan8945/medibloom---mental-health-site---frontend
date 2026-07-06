// Reusable shell for every non-welcome step: title, subtitle, form, nav buttons
import { FaArrowRight } from 'react-icons/fa';

const StepShell = ({ title, subtitle, onSubmit, onBack, children, submitLabel = 'Continue' }) => (
  <form onSubmit={onSubmit} noValidate className="space-y-6">
    {/* Header */}
    <div className="space-y-1 pb-2">
      <h2 className="text-2xl font-title font-bold text-heroBg">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm leading-relaxed">{subtitle}</p>}
    </div>

    {/* Card */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
      {children}
    </div>

    {/* Navigation */}
    <div className="flex justify-between items-center pt-2">
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none px-3 py-2 rounded-lg"
      >
        ← Back
      </button>
      <button
        type="submit"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3 rounded-xl shadow-sm shadow-primary/20 transition-colors duration-150 text-sm focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
      >
        {submitLabel}
        <FaArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </form>
);

export default StepShell;
