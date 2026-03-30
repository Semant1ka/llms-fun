import type { WorkoutSet } from '../types'

export function SetRow({
  index,
  set,
  onChange,
  onRemove,
}: {
  index: number
  set: WorkoutSet
  onChange: (s: WorkoutSet) => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span className="text-slate-500 text-sm w-6">{index + 1}</span>
      <input
        type="number"
        inputMode="numeric"
        placeholder="lbs"
        value={set.weight || ''}
        onChange={(e) =>
          onChange({ ...set, weight: Number(e.target.value) })
        }
        className="bg-slate-700 rounded px-2 py-1.5 w-20 text-sm text-center"
      />
      <span className="text-slate-500 text-xs">x</span>
      <input
        type="number"
        inputMode="numeric"
        placeholder="reps"
        value={set.reps || ''}
        onChange={(e) =>
          onChange({ ...set, reps: Number(e.target.value) })
        }
        className="bg-slate-700 rounded px-2 py-1.5 w-20 text-sm text-center"
      />
      <button
        onClick={() => onChange({ ...set, completed: !set.completed })}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
          set.completed
            ? 'bg-green-600 text-white'
            : 'bg-slate-700 text-slate-400'
        }`}
      >
        {set.completed ? '✓' : '○'}
      </button>
      <button
        onClick={onRemove}
        className="text-slate-500 text-sm hover:text-red-400 ml-auto"
      >
        ✕
      </button>
    </div>
  )
}
