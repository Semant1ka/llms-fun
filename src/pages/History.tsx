import type { Workout } from '../types'
import { Layout } from '../components/Layout'
import { WorkoutCard } from '../components/WorkoutCard'

export function History({
  workouts,
  onDelete,
}: {
  workouts: Workout[]
  onDelete: (id: string) => void
}) {
  return (
    <Layout title="History">
      {workouts.length === 0 ? (
        <p className="text-slate-500 text-center mt-12">
          No workouts yet. Start logging!
        </p>
      ) : (
        workouts.map((w) => (
          <WorkoutCard
            key={w.id}
            workout={w}
            onDelete={() => onDelete(w.id)}
          />
        ))
      )}
    </Layout>
  )
}
