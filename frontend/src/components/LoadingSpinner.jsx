export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-teal-500 border-r-orange-500 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-white/70" />
      </div>
    </div>
  )
}
