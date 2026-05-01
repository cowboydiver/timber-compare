import { create } from 'zustand'

type Tab = 'radar' | 'bar' | 'scatter'

interface StoreState {
  selectedIds: string[]
  activeTab: Tab
  radarWarning: boolean
  barProperty: string
  scatterX: string
  scatterY: string
  scatterColor: string
  select: (id: string) => void
  deselect: (id: string) => void
  setActiveTab: (tab: Tab) => void
  setBarProperty: (key: string) => void
  setScatterX: (key: string) => void
  setScatterY: (key: string) => void
  setScatterColor: (key: string) => void
}

export const useStore = create<StoreState>()((set) => ({
  selectedIds: [],
  activeTab: 'radar',
  radarWarning: false,
  barProperty: '',
  scatterX: '',
  scatterY: '',
  scatterColor: '',

  select: (id: string) => set((s) => {
    if (s.selectedIds.includes(id)) return {}
    const next = [...s.selectedIds, id]
    const radarWarning = s.activeTab === 'radar' && next.length > 6
    return { selectedIds: next, radarWarning }
  }),

  deselect: (id: string) => set((s) => ({ selectedIds: s.selectedIds.filter((x) => x !== id) })),

  setActiveTab: (tab: Tab) => set((s) => ({
    activeTab: tab,
    radarWarning: tab !== 'radar' && s.selectedIds.length <= 6 ? false : s.radarWarning,
  })),

  setBarProperty: (key: string) => set({ barProperty: key }),
  setScatterX: (key: string) => set({ scatterX: key }),
  setScatterY: (key: string) => set({ scatterY: key }),
  setScatterColor: (key: string) => set({ scatterColor: key }),
}))
