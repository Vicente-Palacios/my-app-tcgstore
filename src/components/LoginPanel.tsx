import { colors, fonts, radius } from "../theme";

interface LoginPanelProps {
  onSignIn: () => void;
}

export function LoginLoading() {
  return (
    <>
      <div style={styles.spinner} />
      <p style={{ ...styles.body, marginTop: "18px" }}>
        Verificando tu sesión de AWS Cognito…
      </p>
    </>
  );
}

export function LoginError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <>
      <h2 style={styles.title}>No pudimos iniciar sesión</h2>
      <p style={{ ...styles.body, color: colors.ruby }}>{message}</p>
      <button style={styles.primaryButton} onClick={onRetry}>
        Intentar de nuevo
      </button>
    </>
  );
}

export function LoginPanel({ onSignIn }: LoginPanelProps) {
  return (
    <>
      <h2 style={styles.title}>Bienvenido de vuelta</h2>
      <p style={styles.body}>
        Inicia sesión con el directorio de usuarios de tu tienda para
        administrar el catálogo de cartas.
      </p>
      <button style={styles.primaryButton} onClick={onSignIn}>
        Entrar con Cognito
      </button>
      <p style={styles.footnote}>
        Tus permisos (lectura, edición o borrado) dependen del rol asignado a
        tu cuenta.
      </p>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontFamily: fonts.display,
    fontSize: "24px",
    fontWeight: 600,
    color: colors.ink,
    margin: "0 0 10px",
  },
  body: {
    fontSize: "14px",
    lineHeight: 1.6,
    color: colors.inkMuted,
    margin: "0 0 24px",
  },
  primaryButton: {
    width: "100%",
    padding: "14px 20px",
    fontSize: "15px",
    fontWeight: 600,
    fontFamily: fonts.body,
    color: colors.ink,
    background: colors.gold,
    border: "none",
    borderRadius: radius.md,
    cursor: "pointer",
  },
  footnote: {
    marginTop: "18px",
    fontSize: "12px",
    color: colors.inkMuted,
  },
  spinner: {
    width: "34px",
    height: "34px",
    margin: "0 auto",
    borderRadius: "50%",
    border: `3px solid ${colors.cardBorder}`,
    borderTopColor: colors.gold,
    animation: "spin 0.8s linear infinite",
  },
};
