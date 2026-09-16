import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import TopBar from "../components/TopBar";
import { useUserRoles } from "../hooks/useUserRoles";
import { useCart } from "../context/CartContext";
import { colors, fonts, radius } from "../theme";

export default function DashboardLayout() {
  const auth = useAuth();
  const { roles, isAdmin, isColaborador, isCliente, email } = useUserRoles();
  const { totalItems } = useCart();

  return (
    <div style={styles.page}>
      <TopBar email={email} roles={roles} onLogout={() => auth.removeUser()} />

      <nav style={styles.nav}>
        <NavLink to="/catalogo" style={linkStyle}>
          Catálogo
        </NavLink>
        {(isAdmin || isColaborador) && (
          <NavLink to="/inventario" style={linkStyle}>
            Inventario
          </NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin" style={linkStyle}>
            Administración
          </NavLink>
        )}
        {isCliente && (
          <NavLink to="/carrito" style={linkStyle}>
            Carrito{totalItems > 0 ? ` (${totalItems})` : ""}
          </NavLink>
        )}
      </nav>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

function linkStyle({ isActive }: { isActive: boolean }): React.CSSProperties {
  return {
    padding: "10px 16px",
    borderRadius: radius.pill,
    fontSize: "13px",
    fontWeight: 600,
    textDecoration: "none",
    color: isActive ? colors.ink : colors.onMatMuted,
    background: isActive ? colors.gold : "transparent",
  };
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: colors.mat,
    fontFamily: fonts.body,
  },
  nav: {
    display: "flex",
    gap: "10px",
    padding: "16px 40px 0",
  },
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "24px 32px 64px",
  },
};
