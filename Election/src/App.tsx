import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { RequireUser } from './components/RequireUser'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { ElectionDetailPage } from './pages/ElectionDetailPage'
import { ElectionsPage } from './pages/ElectionsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ResultsPage } from './pages/ResultsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />

        <Route
          path="/"
          element={
            <RequireUser>
              <DashboardPage />
            </RequireUser>
          }
        />
        <Route
          path="/elections"
          element={
            <RequireUser>
              <ElectionsPage />
            </RequireUser>
          }
        />
        <Route
          path="/elections/:id"
          element={
            <RequireUser>
              <ElectionDetailPage />
            </RequireUser>
          }
        />
        <Route
          path="/elections/:id/results"
          element={
            <RequireUser>
              <ResultsPage />
            </RequireUser>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
