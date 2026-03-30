import { useState, useCallback } from 'react'
import type { Workout } from './types'
import { useWorkouts } from './hooks/useWorkouts'
import { BottomNav } from './components/BottomNav'
import { LogWorkout } from './pages/LogWorkout'
import { History } from './pages/History'
import { Progress } from './pages/Progress'
import { Routines } from './pages/Routines'

export type Page = 'log' | 'history' | 'progress' | 'routines'

export default function App() {
  const [page, setPage] = useState<Page>('log')
  const { workouts, loading, save, remove } = useWorkouts()
  const [pendingWorkout, setPendingWorkout] = useState<Workout | null>(null)

  const handleStartRoutine = useCallback(
    (workout: Workout) => {
      setPendingWorkout(workout)
      setPage('log')
    },
    [],
  )

  const handleSave = useCallback(
    async (workout: Workout) => {
      await save(workout)
      setPendingWorkout(null)
    },
    [save],
  )

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center text-slate-500">
        Loading...
      </div>
    )
  }

  return (
    <>
      {page === 'log' && (
        <LogWorkout
          key={pendingWorkout?.id ?? 'new'}
          initialWorkout={pendingWorkout}
          onSave={handleSave}
        />
      )}
      {page === 'history' && (
        <History workouts={workouts} onDelete={remove} />
      )}
      {page === 'progress' && <Progress workouts={workouts} />}
      {page === 'routines' && <Routines onStart={handleStartRoutine} />}

      <BottomNav current={page} onChange={setPage} />
    </>
  )
}
