import { useCart } from "../context/CartContext";
import { colors, fonts, radius, shadow } from "../theme";

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default function CartPage() {
  const { items, totalItems, totalPrice, setQuantity, removeFromCart, clearCart } =
    useCart();

  return (
    <div>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Mi carrito</h1>
          <p style={styles.subtitle}>
            {totalItems === 0
              ? "Todavía no agregaste cartas"
              : `${totalItems} ${totalItems === 1 ? "carta" : "cartas"} en tu carrito`}
          </p>
        </div>
        {items.length > 0 && (
          <button style={styles.clearButton} onClick={clearCart}>
            Vaciar carrito
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyTitle}>Tu carrito está vacío</p>
          <p style={styles.emptyBody}>
            Ve al catálogo y agrega las cartas que quieras comprar.
          </p>
        </div>
      ) : (
        <>
          <div style={styles.list}>
            {items.map(({ card, quantity }) => (
              <div key={card.id} style={styles.row}>
                {card.imageUrl && (
                  <img src={card.imageUrl} alt={card.name} style={styles.thumb} />
                )}
                <div style={styles.info}>
                  <span style={styles.name}>{card.name}</span>
                  <span style={styles.meta}>
                    {card.game} · {card.setName}
                  </span>
                  <span style={styles.price}>{currencyFormatter.format(card.price)}</span>
                </div>

                <div style={styles.quantityControl}>
                  <button
                    style={styles.qtyButton}
                    onClick={() => setQuantity(card.id, quantity - 1)}
                    aria-label="Restar"
                  >
                    −
                  </button>
                  <span style={styles.qtyValue}>{quantity}</span>
                  <button
                    style={styles.qtyButton}
                    onClick={() => setQuantity(card.id, quantity + 1)}
                    disabled={quantity >= card.stock}
                    aria-label="Sumar"
                  >
                    +
                  </button>
                </div>

                <span style={styles.lineTotal}>
                  {currencyFormatter.format(card.price * quantity)}
                </span>

                <button
                  style={styles.removeButton}
                  onClick={() => removeFromCart(card.id)}
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>

          <div style={styles.summary}>
            <span style={styles.summaryLabel}>Total</span>
            <span style={styles.summaryValue}>{currencyFormatter.format(totalPrice)}</span>
          </div>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "14px",
  },
  title: {
    fontFamily: fonts.display,
    fontSize: "28px",
    color: colors.onMat,
    margin: "0 0 4px",
    fontWeight: 600,
  },
  subtitle: {
    fontSize: "13px",
    color: colors.onMatMuted,
    margin: 0,
  },
  clearButton: {
    padding: "10px 16px",
    borderRadius: radius.md,
    border: `1px solid ${colors.matLine}`,
    background: "transparent",
    color: colors.onMat,
    fontSize: "13px",
    cursor: "pointer",
  },
  emptyState: {
    padding: "48px 24px",
    textAlign: "center",
    border: `1px dashed ${colors.matLine}`,
    borderRadius: radius.lg,
    color: colors.onMatMuted,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: "18px",
    color: colors.onMat,
    margin: "0 0 6px",
  },
  emptyBody: {
    fontSize: "13px",
    margin: 0,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: colors.card,
    borderRadius: radius.lg,
    boxShadow: shadow.tile,
    padding: "14px 18px",
  },
  thumb: {
    width: "52px",
    height: "52px",
    objectFit: "cover",
    borderRadius: radius.sm,
    flexShrink: 0,
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
    minWidth: "140px",
  },
  name: {
    fontFamily: fonts.display,
    fontWeight: 600,
    fontSize: "15px",
    color: colors.ink,
  },
  meta: {
    fontSize: "12px",
    color: colors.inkMuted,
  },
  price: {
    fontSize: "12px",
    color: colors.goldStrong,
    fontWeight: 600,
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  qtyButton: {
    width: "28px",
    height: "28px",
    borderRadius: radius.sm,
    border: `1px solid ${colors.cardBorder}`,
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    color: colors.ink,
  },
  qtyValue: {
    minWidth: "20px",
    textAlign: "center",
    fontSize: "13px",
    color: colors.ink,
  },
  lineTotal: {
    fontFamily: fonts.display,
    fontWeight: 600,
    fontSize: "15px",
    color: colors.ink,
    minWidth: "80px",
    textAlign: "right",
  },
  removeButton: {
    fontSize: "12px",
    padding: "8px 12px",
    borderRadius: radius.md,
    border: "none",
    background: colors.rubySoft,
    color: colors.ruby,
    cursor: "pointer",
  },
  summary: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: `1px solid ${colors.matLine}`,
  },
  summaryLabel: {
    fontSize: "14px",
    color: colors.onMatMuted,
  },
  summaryValue: {
    fontFamily: fonts.display,
    fontSize: "24px",
    fontWeight: 600,
    color: colors.gold,
  },
};
