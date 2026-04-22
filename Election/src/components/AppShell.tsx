import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearUser } from '../store/slices/userSlice';

function linkClass({ isActive }: { isActive: boolean }) {
  return `navLink ${isActive ? 'navLinkActive' : ''}`;
}

export function AppShell() {
  const user = useAppSelector((s) => s.user.current);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <>
      <header className="topBar">
        <div className="container topBarInner">
          <div className="brandMark">
            Election <span className="brandSubmark">by Ericsson</span>
          </div>
          <nav className="nav" aria-label="Primary navigation">
            {user ? (
              <>
                <NavLink to="/" className={linkClass} end>
                  Dashboard
                </NavLink>
                <NavLink to="/elections" className={linkClass}>
                  Elections
                </NavLink>
              </>
            ) : null}
            {/* {!user ? (
              <NavLink to="/auth" className={linkClass}>
                Login / Register
              </NavLink>
            ) : null} */}
            {user ? (
              <button
                className="navLink"
                type="button"
                onClick={() => {
                  dispatch(clearUser());
                  navigate('/auth', { replace: true });
                }}
              >
                Logout
              </button>
            ) : null}
          </nav>
        </div>
      </header>
      <main className="appShell">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  );
}
