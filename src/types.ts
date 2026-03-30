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
  reps: number
  weight?: number
}

export interface ExerciseTemplate {
  name: string
  sets: SetTemplate[]
  notes?: string
}

export interface RoutineDefinition {
  id: string
  name: string
  description: string
  exercises: ExerciseTemplate[]
}
