import type { Card } from "../types";
import { colors, fonts, radius, rarityAccent, shadow } from "../theme";

interface CardTileProps {
  card: Card;
  canEdit: boolean;
  canDelete: boolean;
  isConfirmingDelete: boolean;
  onEdit: () => void;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default function CardTile({
  card,
  canEdit,
  canDelete,
  isConfirmingDelete,
  onEdit,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
}: CardTileProps) {
  const lowStock = card.stock <= 2;

  return (
    <article style={styles.tile}>
      <div style={{ ...styles.accentBar, background: rarityAccent(card.rarity) }} />

      <div style={styles.body}>
        <div style={styles.headerRow}>
          <h3 style={styles.name}>{card.name}</h3>
          <span style={styles.rarityPill}>{card.rarity}</span>
        </div>

        <p style={styles.meta}>
          {card.game} · {card.setName}
        </p>
        <p style={styles.condition}>Estado: {card.condition}</p>

        <div style={styles.footerRow}>
          <span style={styles.price}>{currencyFormatter.format(card.price)}</span>
          <span style={lowStock ? styles.stockLow : styles.stock}>
            {card.stock} {card.stock === 1 ? "unidad" : "unidades"}
          </span>
        </div>

        {(canEdit || canDelete) && (
          <div style={styles.actionsRow}>
            {isConfirmingDelete ? (
              <>
                <span style={styles.confirmLabel}>¿Eliminar esta carta?</span>
                <button style={styles.confirmButton} onClick={onConfirmDelete}>
                  Sí, eliminar
                </button>
                <button style={styles.cancelButton} onClick={onCancelDelete}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                {canEdit && (
                  <button style={styles.editButton} onClick={onEdit}>
                    Editar
                  </button>
                )}
                {canDelete && (
                  <button style={styles.deleteButton} onClick={onRequestDelete}>
                    Eliminar
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  tile: {
    display: "flex",
    background: colors.card,
    borderRadius: radius.lg,
    boxShadow: shadow.tile,
    overflow: "hidden",
    fontFamily: fonts.body,
  },
  accentBar: {
    width: "8px",
    flexShrink: 0,
  },
  body: {
    padding: "18px 20px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },
  name: {
    fontFamily: fonts.display,
    fontSize: "18px",
    fontWeight: 600,
    color: colors.ink,
    margin: 0,
  },
  rarityPill: {
    fontSize: "11px",
    fontWeight: 600,
    color: colors.inkMuted,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: radius.pill,
    padding: "3px 9px",
    whiteSpace: "nowrap",
  },
  meta: {
    fontSize: "13px",
    color: colors.inkMuted,
    margin: 0,
  },
  condition: {
    fontSize: "12px",
    color: colors.inkMuted,
    margin: 0,
  },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  price: {
    fontFamily: fonts.display,
    fontSize: "20px",
    fontWeight: 600,
    color: colors.goldStrong,
  },
  stock: {
    fontSize: "12px",
    color: colors.inkMuted,
  },
  stockLow: {
    fontSize: "12px",
    color: colors.ruby,
    fontWeight: 600,
  },
  actionsRow: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  editButton: {
    fontSize: "12px",
    padding: "7px 14px",
    borderRadius: radius.md,
    border: `1px solid ${colors.cardBorder}`,
    background: "transparent",
    color: colors.ink,
    cursor: "pointer",
  },
  deleteButton: {
    fontSize: "12px",
    padding: "7px 14px",
    borderRadius: radius.md,
    border: "none",
    background: colors.rubySoft,
    color: colors.ruby,
    cursor: "pointer",
  },
  confirmLabel: {
    fontSize: "12px",
    color: colors.ruby,
    marginRight: "2px",
  },
  confirmButton: {
    fontSize: "12px",
    padding: "7px 14px",
    borderRadius: radius.md,
    border: "none",
    background: colors.ruby,
    color: colors.card,
    cursor: "pointer",
  },
  cancelButton: {
    fontSize: "12px",
    padding: "7px 14px",
    borderRadius: radius.md,
    border: `1px solid ${colors.cardBorder}`,
    background: "transparent",
    color: colors.inkMuted,
    cursor: "pointer",
  },
};
