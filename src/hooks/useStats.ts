import { useMemo } from 'react'
import type { Workout } from '../types'

export interface ExerciseProgress {
  date: string
  maxWeight: number
  totalVolume: number
}

export function useStats(workouts: Workout[]) {
  const exerciseNames = useMemo(() => {
    const names = new Set<string>()
    for (const w of workouts) {
      for (const e of w.exercises) {
        names.add(e.name)
      }
    }
    return Array.from(names).sort()
  }, [workouts])

  const getProgress = useMemo(() => {
    return (exerciseName: string): ExerciseProgress[] => {
      const entries: ExerciseProgress[] = []
      const sorted = [...workouts].sort((a, b) => a.startedAt - b.startedAt)

      for (const w of sorted) {
        for (const e of w.exercises) {
          if (e.name !== exerciseName) continue
          const completedSets = e.sets.filter((s) => s.completed)
          if (completedSets.length === 0) continue

          const maxWeight = Math.max(...completedSets.map((s) => s.weight))
          const totalVolume = completedSets.reduce(
            (sum, s) => sum + s.weight * s.reps,
            0,
          )
          entries.push({ date: w.date, maxWeight, totalVolume })
        }
      }
      return entries
    }
  }, [workouts])

  return { exerciseNames, getProgress }
}
