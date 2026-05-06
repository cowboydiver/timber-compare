import { useStore } from '../../store/useStore'
import { COLORS } from '../charts/palette'
import type { Wood } from '../../data/types'

interface Props {
  woods: Wood[]
}

const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='84'%3E%3Crect width='64' height='84' fill='%23e8e6d8'/%3E%3Ctext x='32' y='46' text-anchor='middle' font-size='22' fill='%23987f67' font-family='serif'%3E%F0%9F%AA%B5%3C/text%3E%3C/svg%3E`

function getNum(w: Wood, key: string): string {
  const pv = w.properties[key]
  return pv?.type === 'numeric' ? String(pv.value) : '—'
}

function getBotanical(w: Wood): string {
  const pv = w.properties['botanical_name']
  return pv?.type === 'nominal' ? pv.value : ''
}

export function Sidebar({ woods }: Props) {
  const selectedIds = useStore((s) => s.selectedIds)
  const deselect = useStore((s) => s.deselect)
  const clearSelection = useStore((s) => s.clearSelection)
  const drawerOpen = useStore((s) => s.drawerOpen)
  const setDrawerOpen = useStore((s) => s.setDrawerOpen)

  const selectedWoods = selectedIds
    .map((id) => woods.find((w) => w.id === id))
    .filter((w): w is Wood => w !== undefined)

  return (
    <aside className="wb-rail">
      <div className="wb-rail-head">
        <div className="wb-rail-headline">
          <h2>Aktuelt udvalg</h2>
          <button
            className="wb-rail-add"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label={drawerOpen ? 'Luk bibliotek' : 'Åbn bibliotek'}
            title={drawerOpen ? 'Luk bibliotek' : 'Åbn bibliotek'}
          >
            {drawerOpen ? '−' : '+'}
          </button>
        </div>
        <button className="wb-rail-clear" onClick={clearSelection}>Ryd alt</button>
      </div>
      <div className="wb-specimens">
        {selectedWoods.map((w, i) => (
          <article key={w.id} className="wb-spec">
            <span className="wb-spec-bar" style={{ background: COLORS[i % COLORS.length] }} />
            <img
              src={w.imageUrl || PLACEHOLDER}
              alt=""
              className="wb-spec-img"
            />
            <div className="wb-spec-body">
              <h3>{w.nameDa ?? w.id}</h3>
              <p className="wb-spec-bot">{getBotanical(w)}</p>
              <div className="wb-spec-grid">
                <div><span>Vægt</span><strong>{getNum(w, 'weight')}</strong></div>
                <div><span>Janka</span><strong>{getNum(w, 'janka_hardness')}</strong></div>
                <div><span>MOR</span><strong>{getNum(w, 'modulus_of_rupture')}</strong></div>
                <div><span>MOE</span><strong>{getNum(w, 'modulus_of_elasticity')}</strong></div>
              </div>
            </div>
            <button
              className="wb-spec-x"
              onClick={() => deselect(w.id)}
              aria-label={`Fjern ${w.nameDa ?? w.id}`}
            >
              ✕
            </button>
          </article>
        ))}
        {selectedWoods.length === 0 && (
          <p className="wb-spec-empty">Vælg træsorter fra biblioteket.</p>
        )}
      </div>
    </aside>
  )
}
