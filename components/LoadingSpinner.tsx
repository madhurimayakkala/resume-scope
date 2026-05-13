export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="h-14 w-14 rounded-full border-2 border-[#4B5563] border-t-[#F5EFE6] animate-spin" />

      <p className="mt-6 text-secondary">
        Analyzing your resume...
      </p>
    </div>
  );
}