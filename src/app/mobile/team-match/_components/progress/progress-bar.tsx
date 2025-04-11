export default function ProgressBar({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) {
  const progress = (step / totalSteps) * 100;
  return (
    <div className="mb-6 mt-4 h-2 w-full rounded-full bg-gray-200">
      <div
        className="h-2 rounded-full bg-green-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
