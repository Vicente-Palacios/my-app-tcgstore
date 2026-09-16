import { useCards } from "../context/CardsContext";
import { useCart } from "../context/CartContext";
import { useUserRoles } from "../hooks/useUserRoles";
import CardGrid from "../components/CardGrid";
import { colors, fonts } from "../theme";

export default function CatalogPage() {
  const { cards, loading, error } = useCards();
  const { isCliente } = useUserRoles();
  const { addToCart } = useCart();

  return (
    <div>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Catálogo</h1>
          <p style={styles.subtitle}>
            {loading
              ? "Cargando catálogo…"
              : `${cards.length} ${cards.length === 1 ? "carta disponible" : "cartas disponibles"} · solo lectura`}
          </p>
        </div>
      </div>

      {error && <p style={styles.errorBanner}>{error}</p>}

      <CardGrid
        cards={cards}
        canEdit={false}
        canDelete={false}
        onEdit={() => {}}
        onDelete={() => {}}
        onAddToCart={isCliente ? addToCart : undefined}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  headerRow: {
    marginBottom: "20px",
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
  errorBanner: {
    fontSize: "13px",
    color: "#fff",
    background: colors.rubyStrong,
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "20px",
  },
};
