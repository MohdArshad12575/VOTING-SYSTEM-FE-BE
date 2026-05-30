export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-[420px]">
      <div className="text-center">
        <div className="relative mx-auto mb-6 h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-600" />
        </div>
        <p className="text-lg font-semibold text-slate-700">{text}</p>
      </div>
    </div>
  );
}
