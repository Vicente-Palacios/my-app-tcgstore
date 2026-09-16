import { Link } from "react-router-dom";
import { colors, fonts, radius } from "../theme";

export default function NotAuthorizedPage() {
  return (
    <div style={styles.wrapper}>
      <span style={styles.code}>403</span>
      <h1 style={styles.title}>No tienes permiso para ver esta página</h1>
      <p style={styles.body}>
        Tu cuenta no tiene el rol necesario para acceder a esta sección. Si
        crees que deberías tenerlo, pide a un Admin que revise tu grupo en
        Cognito.
      </p>
      <Link to="/catalogo" style={styles.link}>
        Volver al catálogo
      </Link>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    maxWidth: "480px",
    margin: "80px auto",
    textAlign: "center",
    color: colors.onMat,
    fontFamily: fonts.body,
  },
  code: {
    fontFamily: fonts.display,
    fontSize: "14px",
    color: colors.ruby,
    fontWeight: 700,
    letterSpacing: "1px",
  },
  title: {
    fontFamily: fonts.display,
    fontSize: "24px",
    margin: "8px 0 12px",
  },
  body: {
    fontSize: "14px",
    color: colors.onMatMuted,
    lineHeight: 1.6,
    marginBottom: "24px",
  },
  link: {
    display: "inline-block",
    padding: "11px 20px",
    borderRadius: radius.md,
    background: colors.gold,
    color: colors.ink,
    fontWeight: 600,
    fontSize: "13px",
    textDecoration: "none",
  },
};
