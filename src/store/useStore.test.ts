import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from './useStore'

beforeEach(() => {
  useStore.setState({
    selectedIds: [],
    activeTab: 'radar',
    language: 'en',
    radarWarning: false,
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

  it('sets radarWarning when a 7th wood is selected on radar tab', () => {
    ;['a', 'b', 'c', 'd', 'e', 'f'].forEach((id) => useStore.getState().select(id))
    expect(useStore.getState().radarWarning).toBe(false)
    useStore.getState().select('g')
    expect(useStore.getState().radarWarning).toBe(true)
  })

  it('does not set radarWarning when tab is not radar', () => {
    useStore.setState({ activeTab: 'bar' })
    ;['a', 'b', 'c', 'd', 'e', 'f', 'g'].forEach((id) => useStore.getState().select(id))
    expect(useStore.getState().radarWarning).toBe(false)
  })
})

describe('deselect', () => {
  it('removes id from selectedIds', () => {
    useStore.getState().select('oak')
    useStore.getState().deselect('oak')
    expect(useStore.getState().selectedIds).not.toContain('oak')
  })
})

describe('setLanguage', () => {
  it('updates language without clearing selection', () => {
    useStore.getState().select('oak')
    useStore.getState().setLanguage('da')
    expect(useStore.getState().language).toBe('da')
    expect(useStore.getState().selectedIds).toContain('oak')
  })
})

describe('setActiveTab', () => {
  it('updates activeTab', () => {
    useStore.getState().setActiveTab('bar')
    expect(useStore.getState().activeTab).toBe('bar')
  })

  it('clears radarWarning when switching away from radar with ≤6 selected', () => {
    useStore.setState({ radarWarning: true, selectedIds: ['a', 'b'], activeTab: 'radar' })
    useStore.getState().setActiveTab('bar')
    expect(useStore.getState().radarWarning).toBe(false)
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
