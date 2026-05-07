import { create } from 'zustand'
import type { Application } from '../data/types'

type Tab = 'radar' | 'bar' | 'scatter'
export type ColorBy = 'category' | 'origin'

interface StoreState {
  selectedIds: string[]
  hiddenIds: string[]
  hoveredKey: string | null
  activeTab: Tab
  colorBy: ColorBy
  drawerOpen: boolean
  barProperty: string
  scatterX: string
  scatterY: string
  scatterColor: string
  chartApplication: Application | 'all'
  select: (id: string) => void
  deselect: (id: string) => void
  clearSelection: () => void
  selectAll: (ids: string[]) => void
  toggleHidden: (id: string) => void
  setHovered: (key: string | null) => void
  setActiveTab: (tab: Tab) => void
  setColorBy: (value: ColorBy) => void
  setDrawerOpen: (open: boolean) => void
  setBarProperty: (key: string) => void
  setScatterX: (key: string) => void
  setScatterY: (key: string) => void
  setScatterColor: (key: string) => void
  setChartApplication: (app: Application | 'all') => void
}

export const useStore = create<StoreState>()((set) => ({
  selectedIds: [],
  hiddenIds: [],
  hoveredKey: null,
  activeTab: 'radar',
  colorBy: 'category',
  drawerOpen: true,
  barProperty: '',
  scatterX: '',
  scatterY: '',
  scatterColor: '',
  chartApplication: 'all',

  select: (id: string) => set((s) => {
    if (s.selectedIds.includes(id)) return {}
    return { selectedIds: [...s.selectedIds, id] }
  }),

  deselect: (id: string) => set((s) => ({
    selectedIds: s.selectedIds.filter((x) => x !== id),
    hiddenIds: s.hiddenIds.filter((x) => x !== id),
  })),

  clearSelection: () => set({ selectedIds: [], hiddenIds: [] }),

  selectAll: (ids: string[]) => set({ selectedIds: ids }),

  toggleHidden: (id: string) => set((s) => ({
    hiddenIds: s.hiddenIds.includes(id)
      ? s.hiddenIds.filter((x) => x !== id)
      : [...s.hiddenIds, id],
  })),

  setHovered: (key: string | null) => set({ hoveredKey: key }),

  setActiveTab: (tab: Tab) => set({ activeTab: tab }),

  setColorBy: (value: ColorBy) => set({ colorBy: value }),

  setDrawerOpen: (open: boolean) => set({ drawerOpen: open }),

  setBarProperty: (key: string) => set({ barProperty: key }),
  setScatterX: (key: string) => set({ scatterX: key }),
  setScatterY: (key: string) => set({ scatterY: key }),
  setScatterColor: (key: string) => set({ scatterColor: key }),
  setChartApplication: (app: Application | 'all') => set({ chartApplication: app }),
}))
