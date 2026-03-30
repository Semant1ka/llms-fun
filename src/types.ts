export interface WorkoutSet {
  reps: number
  weight: number
  completed: boolean
}

export interface Exercise {
  id: string
  name: string
  sets: WorkoutSet[]
}

export interface Workout {
  id: string
  date: string
  startedAt: number
  completedAt?: number
  name: string
  exercises: Exercise[]
}

export interface SetTemplate {
  reps: number | string
  weight?: number
}

export interface ExerciseTemplate {
  name: string
  sets: SetTemplate[]
  load?: string
  notes?: string
}

export interface RoutineDay {
  name: string
  subtitle: string
  icon?: string
  exercises: ExerciseTemplate[]
  notes?: string[]
}

export interface RoutineDefinition {
  id: string
  name: string
  description: string
  days: RoutineDay[]
}
