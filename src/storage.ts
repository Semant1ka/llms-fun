import { get, set } from 'idb-keyval'
import type { Workout, RoutineDefinition } from './types'

const WORKOUTS_KEY = 'workouts'
const ROUTINES_KEY = 'routines'

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

export async function getAllRoutines(): Promise<RoutineDefinition[]> {
  return (await get<RoutineDefinition[]>(ROUTINES_KEY)) ?? []
}

export async function saveRoutine(routine: RoutineDefinition): Promise<void> {
  const all = await getAllRoutines()
  const idx = all.findIndex((r) => r.id === routine.id)
  if (idx >= 0) all[idx] = routine
  else all.push(routine)
  await set(ROUTINES_KEY, all)
}

export async function deleteRoutine(id: string): Promise<void> {
  const all = await getAllRoutines()
  await set(
    ROUTINES_KEY,
    all.filter((r) => r.id !== id),
  )
}
