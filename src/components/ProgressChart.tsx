import type { ExerciseProgress } from '../hooks/useStats'

const W = 320
const H = 180
const PAD = 40

export function ProgressChart({
  data,
  label,
}: {
  data: ExerciseProgress[]
  label: string
}) {
  if (data.length < 2) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 mb-3">
        <h3 className="font-medium mb-2">{label}</h3>
        <p className="text-sm text-slate-500">
          Need at least 2 sessions to show progress
        </p>
      </div>
    )
  }

  const weights = data.map((d) => d.maxWeight)
  const min = Math.min(...weights)
  const max = Math.max(...weights)
  const range = max - min || 1

  const points = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2)
    const y = H - PAD - ((d.maxWeight - min) / range) * (H - PAD * 2)
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')

  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-3">
      <h3 className="font-medium mb-2">{label}</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Y-axis labels */}
        <text x={PAD - 4} y={PAD} textAnchor="end" className="fill-slate-500 text-[10px]">
          {max}
        </text>
        <text x={PAD - 4} y={H - PAD} textAnchor="end" className="fill-slate-500 text-[10px]">
          {min}
        </text>

        {/* Grid lines */}
        <line x1={PAD} y1={PAD} x2={W - PAD} y2={PAD} className="stroke-slate-700" strokeWidth={0.5} />
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} className="stroke-slate-700" strokeWidth={0.5} />

        {/* Data line */}
        <path d={linePath} fill="none" className="stroke-blue-400" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} className="fill-blue-400" />
        ))}

        {/* X-axis labels (first and last) */}
        <text x={points[0].x} y={H - PAD + 16} textAnchor="middle" className="fill-slate-500 text-[10px]">
          {data[0].date.slice(5)}
        </text>
        <text x={points[points.length - 1].x} y={H - PAD + 16} textAnchor="middle" className="fill-slate-500 text-[10px]">
          {data[data.length - 1].date.slice(5)}
        </text>
      </svg>
    </div>
  )
}
