import { useState, useEffect, useRef, useCallback } from 'react'
import type { Workout, RoutineDefinition } from '../types'
import { Layout } from '../components/Layout'
import { getAllRoutines, saveRoutine, deleteRoutine } from '../storage'

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

function validateRoutine(data: unknown): data is RoutineDefinition {
  if (!data || typeof data !== 'object') return false
  const r = data as Record<string, unknown>
  if (typeof r.name !== 'string' || typeof r.description !== 'string') return false
  if (!Array.isArray(r.exercises)) return false
  for (const ex of r.exercises) {
    if (typeof ex.name !== 'string' || !Array.isArray(ex.sets)) return false
    for (const s of ex.sets) {
      if (typeof s.reps !== 'number') return false
    }
  }
  return true
}

export function Routines({
  onStart,
}: {
  onStart: (w: Workout) => void
}) {
  const [routines, setRoutines] = useState<RoutineDefinition[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const reload = useCallback(async () => {
    setRoutines(await getAllRoutines())
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Support both single routine and array of routines
      const items: unknown[] = Array.isArray(data) ? data : [data]

      for (const item of items) {
        if (!validateRoutine(item)) {
          setError('Invalid routine format. Expected { name, description, exercises: [{ name, sets: [{ reps }] }] }')
          return
        }
        const routine: RoutineDefinition = {
          ...item,
          id: item.id ?? crypto.randomUUID(),
        }
        await saveRoutine(routine)
      }

      await reload()
    } catch {
      setError('Failed to parse JSON file.')
    }

    // Reset input so the same file can be re-imported
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = async (id: string) => {
    await deleteRoutine(id)
    await reload()
  }

  return (
    <Layout title="Routines">
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />

      <button
        onClick={() => fileRef.current?.click()}
        className="w-full py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-colors mb-4"
      >
        + Import Routine (.json)
      </button>

      {error && (
        <p className="text-red-400 text-sm mb-4 bg-red-400/10 rounded-lg p-3">
          {error}
        </p>
      )}

      {routines.length === 0 ? (
        <p className="text-slate-500 text-center mt-8">
          No routines yet. Import a .json file to get started.
        </p>
      ) : (
        routines.map((r) => (
          <div key={r.id} className="bg-slate-800 rounded-lg p-4 mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{r.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{r.description}</p>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-slate-500 text-xs hover:text-red-400"
              >
                Delete
              </button>
            </div>
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
