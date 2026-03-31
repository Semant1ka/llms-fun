import type { Workout } from '../types'

export function WorkoutCard({
  workout,
  onDelete,
}: {
  workout: Workout
  onDelete: () => void
}) {
  const totalSets = workout.exercises.reduce(
    (sum, e) => sum + e.sets.filter((s) => s.completed).length,
    0,
  )
  const duration = workout.completedAt
    ? Math.round((workout.completedAt - workout.startedAt) / 60000)
    : null

  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{workout.name || 'Untitled Workout'}</h3>
          <p className="text-sm text-slate-400 mt-1">{workout.date}</p>
        </div>
        <button
          onClick={onDelete}
          className="text-slate-500 text-xs hover:text-red-400"
        >
          Delete
        </button>
      </div>
      <div className="flex gap-4 mt-3 text-sm text-slate-400">
        <span>{workout.exercises.length} exercises</span>
        <span>{totalSets} sets</span>
        {duration !== null && <span>{duration} min</span>}
      </div>
    </div>
  )
}
