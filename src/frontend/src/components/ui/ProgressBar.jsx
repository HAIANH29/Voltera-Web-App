export default function ProgressBar({ percent = 0 }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2">
        <span>Step progress</span>
        <span>{percent}% Complete</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 bg-black rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
