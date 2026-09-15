import type { ReactNode } from "react";
import { colors, fonts, radius, shadow } from "../theme";

interface AuthShellProps {
  children: ReactNode;
}

// Envoltorio compartido por las 3 vistas previas al dashboard:
// cargando sesión, error de autenticación y pantalla de login.
export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div style={styles.page}>
      <div style={styles.brandPanel}>
        <span style={styles.brandMark}>TCG Store</span>
        <h1 style={styles.brandHeadline}>
          Tu catálogo de cartas, siempre bajo control.
        </h1>
        <p style={styles.brandCopy}>
          Gestiona precios, stock y rareza de cada carta de tu tienda desde un
          solo panel, protegido con tu cuenta de AWS Cognito.
        </p>
        <ul style={styles.brandList}>
          <li>Inventario en tiempo real conectado a tu backend</li>
          <li>Accesos por rol: lectura pública, edición para tu equipo</li>
          <li>Pensado para Pokémon, Magic, Yu-Gi-Oh y más</li>
        </ul>
      </div>

      <div style={styles.actionPanel}>
        <div style={styles.actionCard}>{children}</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "row",
    fontFamily: fonts.body,
    background: colors.mat,
  },
  brandPanel: {
    flex: "1 1 50%",
    padding: "72px 64px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "20px",
    color: colors.onMat,
  },
  brandMark: {
    fontFamily: fonts.display,
    fontSize: "15px",
    letterSpacing: "0.4px",
    color: colors.gold,
    fontWeight: 600,
  },
  brandHeadline: {
    fontFamily: fonts.display,
    fontSize: "40px",
    lineHeight: 1.15,
    margin: 0,
    maxWidth: "460px",
    fontWeight: 600,
  },
  brandCopy: {
    fontSize: "16px",
    lineHeight: 1.6,
    color: colors.onMatMuted,
    maxWidth: "420px",
    margin: 0,
  },
  brandList: {
    listStyle: "none",
    padding: 0,
    margin: "12px 0 0",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    fontSize: "14px",
    color: colors.onMatMuted,
    maxWidth: "420px",
  },
  actionPanel: {
    flex: "1 1 50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    background: colors.card,
  },
  actionCard: {
    width: "100%",
    maxWidth: "380px",
    background: colors.card,
    borderRadius: radius.lg,
    boxShadow: shadow.soft,
    padding: "40px 36px",
    textAlign: "center",
  },
};
