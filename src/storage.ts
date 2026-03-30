import { get, set } from 'idb-keyval'
import type { Workout } from './types'

const WORKOUTS_KEY = 'workouts'

export async function getAllWorkouts(): Promise<Workout[]> {
  return (await get<Workout[]>(WORKOUTS_KEY)) ?? []
}

export async function saveWorkout(workout: Workout): Promise<void> {
  const all = await getAllWorkouts()
  const idx = all.findIndex((w) => w.id === workout.id)
  if (idx >= 0) all[idx] = workout
  else all.push(workout)
  await set(WORKOUTS_KEY, all)
}

export async function deleteWorkout(id: string): Promise<void> {
  const all = await getAllWorkouts()
  await set(
    WORKOUTS_KEY,
    all.filter((w) => w.id !== id),
  )
}
