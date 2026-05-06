import { create } from 'zustand'

type Tab = 'radar' | 'bar' | 'scatter'

interface StoreState {
  selectedIds: string[]
  activeTab: Tab
  barProperty: string
  scatterX: string
  scatterY: string
  scatterColor: string
  select: (id: string) => void
  deselect: (id: string) => void
  clearSelection: () => void
  setActiveTab: (tab: Tab) => void
  setBarProperty: (key: string) => void
  setScatterX: (key: string) => void
  setScatterY: (key: string) => void
  setScatterColor: (key: string) => void
}

export const useStore = create<StoreState>()((set) => ({
  selectedIds: [],
  activeTab: 'radar',
  barProperty: '',
  scatterX: '',
  scatterY: '',
  scatterColor: '',

  select: (id: string) => set((s) => {
    if (s.selectedIds.includes(id)) return {}
    return { selectedIds: [...s.selectedIds, id] }
  }),

  deselect: (id: string) => set((s) => ({ selectedIds: s.selectedIds.filter((x) => x !== id) })),

  clearSelection: () => set({ selectedIds: [] }),

  setActiveTab: (tab: Tab) => set({ activeTab: tab }),

  setBarProperty: (key: string) => set({ barProperty: key }),
  setScatterX: (key: string) => set({ scatterX: key }),
  setScatterY: (key: string) => set({ scatterY: key }),
  setScatterColor: (key: string) => set({ scatterColor: key }),
}))
