import type { Exercise, WorkoutSet } from '../types'
import { SetRow } from './SetRow'

export function ExerciseInput({
  exercise,
  onChange,
  onRemove,
}: {
  exercise: Exercise
  onChange: (e: Exercise) => void
  onRemove: () => void
}) {
  const updateSet = (idx: number, set: WorkoutSet) => {
    const sets = [...exercise.sets]
    sets[idx] = set
    onChange({ ...exercise, sets })
  }

  const removeSet = (idx: number) => {
    onChange({ ...exercise, sets: exercise.sets.filter((_, i) => i !== idx) })
  }

  const addSet = () => {
    const last = exercise.sets[exercise.sets.length - 1]
    const newSet: WorkoutSet = last
      ? { ...last, completed: false }
      : { reps: 0, weight: 0, completed: false }
    onChange({ ...exercise, sets: [...exercise.sets, newSet] })
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <input
          type="text"
          value={exercise.name}
          onChange={(e) => onChange({ ...exercise, name: e.target.value })}
          placeholder="Exercise name"
          className="bg-transparent text-white font-medium text-base outline-none flex-1"
        />
        <button
          onClick={onRemove}
          className="text-slate-500 text-sm hover:text-red-400 ml-2"
        >
          Remove
        </button>
      </div>

      <div className="flex items-center gap-2 py-1 text-xs text-slate-500 mb-1">
        <span className="w-6">Set</span>
        <span className="w-20 text-center">Weight</span>
        <span className="w-4" />
        <span className="w-20 text-center">Reps</span>
      </div>

      {exercise.sets.map((set, i) => (
        <SetRow
          key={i}
          index={i}
          set={set}
          onChange={(s) => updateSet(i, s)}
          onRemove={() => removeSet(i)}
        />
      ))}

      <button
        onClick={addSet}
        className="mt-2 text-sm text-blue-400 hover:text-blue-300"
      >
        + Add Set
      </button>
    </div>
  )
}
