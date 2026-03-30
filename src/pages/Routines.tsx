import type { Workout, RoutineDefinition } from '../types'
import { Layout } from '../components/Layout'
import { routines } from '../routines'

function startFromRoutine(routine: RoutineDefinition): Workout {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString().slice(0, 10),
    startedAt: Date.now(),
    name: routine.name,
    exercises: routine.exercises.map((ex) => ({
      id: crypto.randomUUID(),
      name: ex.name,
      sets: ex.sets.map((s) => ({
        reps: s.reps,
        weight: s.weight ?? 0,
        completed: false,
      })),
    })),
  }
}

export function Routines({
  onStart,
}: {
  onStart: (w: Workout) => void
}) {
  return (
    <Layout title="Routines">
      {routines.length === 0 ? (
        <p className="text-slate-500 text-center mt-12">
          No routines defined yet.
        </p>
      ) : (
        routines.map((r) => (
          <div key={r.id} className="bg-slate-800 rounded-lg p-4 mb-3">
            <h3 className="font-medium">{r.name}</h3>
            <p className="text-sm text-slate-400 mt-1">{r.description}</p>
            <div className="text-xs text-slate-500 mt-2">
              {r.exercises.map((e) => e.name).join(' · ')}
            </div>
            <button
              onClick={() => onStart(startFromRoutine(r))}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors"
            >
              Start Workout
            </button>
          </div>
        ))
      )}
    </Layout>
  )
}
