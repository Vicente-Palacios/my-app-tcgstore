import { colors, fonts, radius } from "../theme";

interface TopBarProps {
  email?: string;
  roles: string[];
  onLogout: () => void;
}

export default function TopBar({ email, roles, onLogout }: TopBarProps) {
  return (
    <header style={styles.bar}>
      <div style={styles.brand}>
        <span style={styles.brandMark}>TCG Store</span>
        <span style={styles.brandSub}>Panel de inventario</span>
      </div>

      <div style={styles.userArea}>
        <div style={styles.userChip}>
          <span style={styles.userEmail}>{email ?? "Sesión activa"}</span>
          <div style={styles.roleRow}>
            {roles.length > 0 ? (
              roles.map((role) => (
                <span key={role} style={styles.roleBadge}>
                  {role}
                </span>
              ))
            ) : (
              <span style={styles.roleBadgeMuted}>Solo lectura</span>
            )}
          </div>
        </div>
        <button style={styles.logoutButton} onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    background: colors.matDeep,
    color: colors.onMat,
    fontFamily: fonts.body,
  },
  brand: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  brandMark: {
    fontFamily: fonts.display,
    fontSize: "20px",
    fontWeight: 600,
  },
  brandSub: {
    fontSize: "12px",
    color: colors.onMatMuted,
  },
  userArea: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  userChip: {
    textAlign: "right",
  },
  userEmail: {
    display: "block",
    fontSize: "13px",
    color: colors.onMat,
  },
  roleRow: {
    display: "flex",
    gap: "6px",
    justifyContent: "flex-end",
    marginTop: "4px",
  },
  roleBadge: {
    fontSize: "11px",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: radius.pill,
    background: colors.goldSoft,
    color: colors.gold,
  },
  roleBadgeMuted: {
    fontSize: "11px",
    color: colors.onMatMuted,
    fontStyle: "italic",
  },
  logoutButton: {
    background: "transparent",
    color: colors.onMat,
    border: `1px solid ${colors.matLine}`,
    padding: "9px 16px",
    borderRadius: radius.md,
    cursor: "pointer",
    fontSize: "13px",
  },
};
