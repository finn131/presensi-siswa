export default function Card({ title, value, subtitle, className = '' }) {
  return (
    <div className={`card animate__animated animate__fadeInUp ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
