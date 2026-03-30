import { useState } from 'react'
import type { Workout } from '../types'
import { useStats } from '../hooks/useStats'
import { Layout } from '../components/Layout'
import { ProgressChart } from '../components/ProgressChart'

export function Progress({ workouts }: { workouts: Workout[] }) {
  const { exerciseNames, getProgress } = useStats(workouts)
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <Layout title="Progress">
      {exerciseNames.length === 0 ? (
        <p className="text-slate-500 text-center mt-12">
          Complete some workouts to see progress charts.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {exerciseNames.map((name) => (
              <button
                key={name}
                onClick={() =>
                  setSelected(selected === name ? null : name)
                }
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selected === name
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {selected ? (
            <ProgressChart
              data={getProgress(selected)}
              label={selected}
            />
          ) : (
            exerciseNames.map((name) => (
              <ProgressChart
                key={name}
                data={getProgress(name)}
                label={name}
              />
            ))
          )}
        </>
      )}
    </Layout>
  )
}
