import { useStore } from './store/useStore'
import { Layout } from './components/Layout/Layout'
import { Header } from './components/Header/Header'
import { Sidebar } from './components/Sidebar/Sidebar'
import { ChartPanel } from './components/ChartPanel/ChartPanel'
import { Drawer } from './components/Drawer/Drawer'
import woodsData from './data/woods.json'
import type { Wood } from './data/types'
import './App.css'

const woods = woodsData as Wood[]

export default function App() {
  const drawerOpen = useStore((s) => s.drawerOpen)

  return (
    <Layout>
      <Header />
      <div className={`wb-body${drawerOpen ? '' : ' wb-body-no-drawer'}`}>
        <Sidebar woods={woods} />
        <ChartPanel woods={woods} />
        {drawerOpen && <Drawer woods={woods} />}
      </div>
    </Layout>
  )
}
