// Consistent question wrapper used in every step
const QuestionRow = ({ label, emoji, children, required }) => (
  <div className="space-y-3">
    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">
      {emoji && <span className="mr-2">{emoji}</span>}
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </p>
    {children}
  </div>
);

export default QuestionRow;
