const toneMap = {
  cyan: 'from-cyan-500 to-sky-500',
  emerald: 'from-emerald-500 to-teal-500',
  amber: 'from-amber-500 to-orange-500',
  rose: 'from-rose-500 to-red-500',
}

export default function Card({ title, value, subtitle, tone = 'cyan', className = '' }) {
  return (
    <div className={`card panel-smooth hover-lift group relative overflow-hidden animate__animated animate__fadeInUp ${className}`}>
      <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${toneMap[tone]} opacity-20 transition-all duration-500 ease-out group-hover:scale-110 group-hover:opacity-30`} />
      <div className="relative">
        <p className="text-sm font-semibold text-slate-600 transition-colors duration-300 group-hover:text-slate-700">{title}</p>
        <p className="text-3xl lg:text-4xl font-extrabold mt-2 text-slate-900 transition-transform duration-300 group-hover:translate-x-0.5">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}
