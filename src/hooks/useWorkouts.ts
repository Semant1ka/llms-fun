import { useState, useEffect, useCallback } from 'react'
import type { Workout } from '../types'
import { getAllWorkouts, saveWorkout, deleteWorkout } from '../storage'

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const all = await getAllWorkouts()
    setWorkouts(all.sort((a, b) => b.startedAt - a.startedAt))
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const save = useCallback(
    async (workout: Workout) => {
      await saveWorkout(workout)
      await reload()
    },
    [reload],
  )

  const remove = useCallback(
    async (id: string) => {
      await deleteWorkout(id)
      await reload()
    },
    [reload],
  )

  return { workouts, loading, save, remove, reload }
}
