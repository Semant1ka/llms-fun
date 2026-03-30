import { useState, useEffect, useRef, useCallback } from 'react'
import type { Workout, RoutineDefinition, RoutineDay } from '../types'
import { Layout } from '../components/Layout'
import { getAllRoutines, saveRoutine, deleteRoutine } from '../storage'

function startFromDay(routine: RoutineDefinition, day: RoutineDay): Workout {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString().slice(0, 10),
    startedAt: Date.now(),
    name: `${routine.name} — ${day.name}`,
    exercises: day.exercises.map((ex) => ({
      id: crypto.randomUUID(),
      name: ex.name,
      sets: ex.sets.map((s) => ({
        reps: typeof s.reps === 'number' ? s.reps : 0,
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
  if (!Array.isArray(r.days)) return false
  for (const day of r.days) {
    if (typeof day.name !== 'string' || !Array.isArray(day.exercises)) return false
    for (const ex of day.exercises) {
      if (typeof ex.name !== 'string' || !Array.isArray(ex.sets)) return false
    }
  }
  return true
}

function ExerciseRow({
  index,
  name,
  sets,
  reps,
  load,
  notes,
}: {
  index: number
  name: string
  sets: number
  reps: string
  load?: string
  notes?: string
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="border-b border-slate-700/50 last:border-b-0 cursor-pointer"
      onClick={() => notes && setExpanded(!expanded)}
    >
      <div className="flex items-center py-3 px-2 gap-3">
        <span className="w-7 h-7 rounded-full bg-amber-800/60 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">
          {index}
        </span>
        <span className="flex-1 text-sm font-medium min-w-0">{name}</span>
        <span className="text-sm text-slate-300 w-10 text-center">{sets}</span>
        <span className="text-sm text-slate-300 w-14 text-center">{reps}</span>
        <span className="text-xs text-slate-500 w-28 text-right truncate">
          {load ?? ''}
        </span>
      </div>
      {expanded && notes && (
        <div className="px-2 pb-3 pl-12">
          <p className="text-xs text-slate-400 leading-relaxed">{notes}</p>
        </div>
      )}
    </div>
  )
}

function RoutineView({
  routine,
  onStart,
  onDelete,
}: {
  routine: RoutineDefinition
  onStart: (w: Workout) => void
  onDelete: () => void
}) {
  const [selectedDay, setSelectedDay] = useState(0)
  const day = routine.days[selectedDay]

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">{routine.name}</h2>
        <button
          onClick={onDelete}
          className="text-slate-500 text-xs hover:text-red-400"
        >
          Delete
        </button>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {routine.days.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={`shrink-0 rounded-xl px-4 py-3 text-left transition-colors ${
              i === selectedDay
                ? 'bg-slate-700 ring-1 ring-amber-600/50'
                : 'bg-slate-800'
            }`}
          >
            {d.icon && <span className="text-lg block mb-0.5">{d.icon}</span>}
            <span className="text-sm font-medium text-amber-300 block">
              {d.name}
            </span>
            <span className="text-xs text-slate-400">{d.subtitle}</span>
          </button>
        ))}
      </div>

      {/* Exercise table */}
      <div className="bg-slate-800 rounded-xl overflow-hidden mb-3">
        {/* Header */}
        <div className="flex items-center py-2 px-2 gap-3 border-b border-slate-700 text-[10px] uppercase tracking-wider text-slate-500">
          <span className="w-7" />
          <span className="flex-1">Exercise</span>
          <span className="w-10 text-center">Sets</span>
          <span className="w-14 text-center">Reps</span>
          <span className="w-28 text-right">Load</span>
        </div>

        {/* Rows */}
        {day.exercises.map((ex, i) => {
          const numSets = ex.sets.length
          const repsDisplay =
            ex.sets.length > 0
              ? typeof ex.sets[0].reps === 'string'
                ? ex.sets[0].reps
                : String(ex.sets[0].reps)
              : '—'

          return (
            <ExerciseRow
              key={i}
              index={i + 1}
              name={ex.name}
              sets={numSets}
              reps={repsDisplay}
              load={ex.load}
              notes={ex.notes}
            />
          )
        })}
      </div>

      {/* Notes section */}
      {day.notes && day.notes.length > 0 && (
        <div className="mb-3">
          <h4 className="text-[10px] uppercase tracking-wider text-amber-300/70 mb-2">
            Notes
          </h4>
          {day.notes.map((note, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p className="text-xs text-slate-400 leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => onStart(startFromDay(routine, day))}
        className="w-full py-3 bg-amber-700 hover:bg-amber-600 rounded-xl font-medium transition-colors text-sm"
      >
        Start {day.name}
      </button>
    </div>
  )
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

      const items: unknown[] = Array.isArray(data) ? data : [data]

      for (const item of items) {
        if (!validateRoutine(item)) {
          setError(
            'Invalid format. Expected { name, description, days: [{ name, subtitle, exercises }] }',
          )
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
        className="w-full py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-amber-600 hover:text-amber-400 transition-colors mb-4"
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
          <RoutineView
            key={r.id}
            routine={r}
            onStart={onStart}
            onDelete={() => handleDelete(r.id)}
          />
        ))
      )}
    </Layout>
  )
}
