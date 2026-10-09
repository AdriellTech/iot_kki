import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MonitoringPage } from './pages/MonitoringPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MonitoringPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
