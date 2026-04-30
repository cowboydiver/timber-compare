import { Layout } from './components/Layout/Layout'
import { Header } from './components/Header/Header'
import { Sidebar } from './components/Sidebar/Sidebar'
import { ChartPanel } from './components/ChartPanel/ChartPanel'
import woodsData from './data/woods.json'
import type { Wood } from './data/types'
import './App.css'

const woods = woodsData as Wood[]

export default function App() {
  return (
    <Layout>
      <Header />
      <div className="app-body">
        <Sidebar woods={woods} />
        <ChartPanel woods={woods} />
      </div>
    </Layout>
  )
}
