import { useState } from 'react'
import type { Workout, Exercise } from '../types'
import { Layout } from '../components/Layout'
import { ExerciseInput } from '../components/ExerciseInput'

export function LogWorkout({
  initialWorkout,
  onSave,
}: {
  initialWorkout?: Workout | null
  onSave: (w: Workout) => void
}) {
  const [workout, setWorkout] = useState<Workout>(
    () =>
      initialWorkout ?? {
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        startedAt: Date.now(),
        name: '',
        exercises: [],
      },
  )

  const updateExercise = (idx: number, exercise: Exercise) => {
    const exercises = [...workout.exercises]
    exercises[idx] = exercise
    setWorkout({ ...workout, exercises })
  }

  const removeExercise = (idx: number) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.filter((_, i) => i !== idx),
    })
  }

  const addExercise = () => {
    const ex: Exercise = {
      id: crypto.randomUUID(),
      name: '',
      sets: [{ reps: 0, weight: 0, completed: false }],
    }
    setWorkout({ ...workout, exercises: [...workout.exercises, ex] })
  }

  const finish = () => {
    const completed = { ...workout, completedAt: Date.now() }
    onSave(completed)
    // Reset for next workout
    setWorkout({
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      startedAt: Date.now(),
      name: '',
      exercises: [],
    })
  }

  return (
    <Layout title="Log Workout">
      <input
        type="text"
        value={workout.name}
        onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
        placeholder="Workout name (e.g. Push Day)"
        className="w-full bg-slate-800 rounded-lg px-4 py-3 mb-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
      />

      {workout.exercises.map((ex, i) => (
        <ExerciseInput
          key={ex.id}
          exercise={ex}
          onChange={(e) => updateExercise(i, e)}
          onRemove={() => removeExercise(i)}
        />
      ))}

      <button
        onClick={addExercise}
        className="w-full py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-colors mb-4"
      >
        + Add Exercise
      </button>

      {workout.exercises.length > 0 && (
        <button
          onClick={finish}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
        >
          Finish Workout
        </button>
      )}
    </Layout>
  )
}
