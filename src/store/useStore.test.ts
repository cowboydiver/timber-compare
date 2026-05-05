import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from './useStore'

beforeEach(() => {
  useStore.setState({
    selectedIds: [],
    activeTab: 'radar',
    barProperty: '',
    scatterX: '',
    scatterY: '',
    scatterColor: '',
  })
})

describe('select', () => {
  it('adds id to selectedIds', () => {
    useStore.getState().select('oak')
    expect(useStore.getState().selectedIds).toContain('oak')
  })

  it('is idempotent — duplicate select does not add twice', () => {
    useStore.getState().select('oak')
    useStore.getState().select('oak')
    expect(useStore.getState().selectedIds.filter((id) => id === 'oak')).toHaveLength(1)
  })
})

describe('deselect', () => {
  it('removes id from selectedIds', () => {
    useStore.getState().select('oak')
    useStore.getState().deselect('oak')
    expect(useStore.getState().selectedIds).not.toContain('oak')
  })
})

describe('clearSelection', () => {
  it('empties selectedIds', () => {
    useStore.getState().select('oak')
    useStore.getState().select('teak')
    useStore.getState().clearSelection()
    expect(useStore.getState().selectedIds).toHaveLength(0)
  })
})

describe('setActiveTab', () => {
  it('updates activeTab', () => {
    useStore.getState().setActiveTab('bar')
    expect(useStore.getState().activeTab).toBe('bar')
  })
})

describe('axis config setters', () => {
  it('setBarProperty updates barProperty', () => {
    useStore.getState().setBarProperty('weight')
    expect(useStore.getState().barProperty).toBe('weight')
  })

  it('setScatterX/Y/Color update their fields independently', () => {
    useStore.getState().setScatterX('weight')
    useStore.getState().setScatterY('janka_hardness')
    useStore.getState().setScatterColor('origin')
    const s = useStore.getState()
    expect(s.scatterX).toBe('weight')
    expect(s.scatterY).toBe('janka_hardness')
    expect(s.scatterColor).toBe('origin')
  })
})
