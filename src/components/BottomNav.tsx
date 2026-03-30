import type { Page } from '../App'

const tabs: { page: Page; label: string; icon: string }[] = [
  { page: 'log', label: 'Log', icon: '＋' },
  { page: 'history', label: 'History', icon: '☰' },
  { page: 'progress', label: 'Progress', icon: '↗' },
  { page: 'routines', label: 'Routines', icon: '♦' },
]

export function BottomNav({
  current,
  onChange,
}: {
  current: Page
  onChange: (p: Page) => void
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex safe-bottom">
      {tabs.map((t) => (
        <button
          key={t.page}
          onClick={() => onChange(t.page)}
          className={`flex-1 flex flex-col items-center py-3 text-xs transition-colors ${
            current === t.page
              ? 'text-blue-400'
              : 'text-slate-400 active:text-slate-200'
          }`}
        >
          <span className="text-lg leading-none mb-1">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  )
}
