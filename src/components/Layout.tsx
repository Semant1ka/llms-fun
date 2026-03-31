import type { ReactNode } from 'react'

export function Layout({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <h1 className="text-lg font-semibold">{title}</h1>
      </header>
      <main className="flex-1 overflow-y-auto pb-20 px-4 py-4">
        {children}
      </main>
    </div>
  )
}
