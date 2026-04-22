import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

export function RequireUser({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((s) => s.user.current)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}

