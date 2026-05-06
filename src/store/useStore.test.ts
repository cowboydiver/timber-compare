import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from './useStore'

beforeEach(() => {
  useStore.setState({
    selectedIds: [],
    hiddenIds: [],
    hoveredKey: null,
    activeTab: 'radar',
    colorBy: 'category',
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

  it('also removes id from hiddenIds', () => {
    useStore.setState({ selectedIds: ['oak'], hiddenIds: ['oak'] })
    useStore.getState().deselect('oak')
    expect(useStore.getState().hiddenIds).not.toContain('oak')
  })
})

describe('clearSelection', () => {
  it('empties selectedIds', () => {
    useStore.getState().select('oak')
    useStore.getState().select('teak')
    useStore.getState().clearSelection()
    expect(useStore.getState().selectedIds).toHaveLength(0)
  })

  it('also empties hiddenIds', () => {
    useStore.setState({ selectedIds: ['oak'], hiddenIds: ['oak'] })
    useStore.getState().clearSelection()
    expect(useStore.getState().hiddenIds).toHaveLength(0)
  })
})

describe('selectAll', () => {
  it('replaces selectedIds with provided list', () => {
    useStore.getState().selectAll(['a', 'b', 'c'])
    expect(useStore.getState().selectedIds).toEqual(['a', 'b', 'c'])
  })
})

describe('toggleHidden', () => {
  it('adds id to hiddenIds when not hidden', () => {
    useStore.getState().toggleHidden('oak')
    expect(useStore.getState().hiddenIds).toContain('oak')
  })

  it('removes id from hiddenIds when already hidden', () => {
    useStore.setState({ hiddenIds: ['oak'] })
    useStore.getState().toggleHidden('oak')
    expect(useStore.getState().hiddenIds).not.toContain('oak')
  })
})

describe('setHovered', () => {
  it('updates hoveredKey', () => {
    useStore.getState().setHovered('oak')
    expect(useStore.getState().hoveredKey).toBe('oak')
  })

  it('can be set to null', () => {
    useStore.setState({ hoveredKey: 'oak' })
    useStore.getState().setHovered(null)
    expect(useStore.getState().hoveredKey).toBeNull()
  })
})

describe('setActiveTab', () => {
  it('updates activeTab', () => {
    useStore.getState().setActiveTab('bar')
    expect(useStore.getState().activeTab).toBe('bar')
  })
})

describe('setColorBy', () => {
  it('updates colorBy', () => {
    useStore.getState().setColorBy('origin')
    expect(useStore.getState().colorBy).toBe('origin')
  })
})

describe('axis config setters', () => {
  it('setBarProperty updates barProperty', () => {
    useStore.getState().setBarProperty('weight')
    expect(useStore.getState().barProperty).toBe('weight')
  })

  it('setScatterX/Y update their fields independently', () => {
    useStore.getState().setScatterX('weight')
    useStore.getState().setScatterY('janka_hardness')
    const s = useStore.getState()
    expect(s.scatterX).toBe('weight')
    expect(s.scatterY).toBe('janka_hardness')
  })

  it('setScatterColor updates scatterColor', () => {
    useStore.getState().setScatterColor('origin')
    expect(useStore.getState().scatterColor).toBe('origin')
  })
})
