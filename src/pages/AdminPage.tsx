import { useMemo, useState } from "react";
import { useCards } from "../context/CardsContext";
import CardGrid from "../components/CardGrid";
import CardFormPanel from "../components/CardFormPanel";
import type { Card, CardInput } from "../types";
import { colors, fonts, radius, shadow } from "../theme";

export default function AdminPage() {
  const { cards, loading, error, create, update, remove } = useCards();

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalValue = cards.reduce((sum, c) => sum + c.price * c.stock, 0);
    const lowStock = cards.filter((c) => c.stock <= 2).length;
    return { totalValue, lowStock, total: cards.length };
  }, [cards]);

  function openCreatePanel() {
    setEditingCard(null);
    setFormError(null);
    setPanelOpen(true);
  }

  function openEditPanel(card: Card) {
    setEditingCard(card);
    setFormError(null);
    setPanelOpen(true);
  }

  async function handleSubmit(data: CardInput) {
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingCard) {
        await update(editingCard.id, data);
      } else {
        await create(data);
      }
      setPanelOpen(false);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(card: Card) {
    try {
      await remove(card);
    } catch {
      // El contexto ya revierte el estado optimista.
    }
  }

  const currency = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return (
    <div>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Administración</h1>
          <p style={styles.subtitle}>
            Control total del inventario · acceso exclusivo Admin
          </p>
        </div>
        <button style={styles.addButton} onClick={openCreatePanel}>
          Nueva carta
        </button>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{loading ? "…" : stats.total}</span>
          <span style={styles.statLabel}>Cartas en catálogo</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>
            {loading ? "…" : currency.format(stats.totalValue)}
          </span>
          <span style={styles.statLabel}>Valor total del inventario</span>
        </div>
        <div style={styles.statCard}>
          <span style={{ ...styles.statValue, color: colors.ruby }}>
            {loading ? "…" : stats.lowStock}
          </span>
          <span style={styles.statLabel}>Cartas con stock bajo (≤ 2)</span>
        </div>
      </div>

      {error && <p style={styles.errorBanner}>{error}</p>}

      <CardGrid
        cards={cards}
        canEdit
        canDelete
        onEdit={openEditPanel}
        onDelete={handleDelete}
      />

      <CardFormPanel
        open={panelOpen}
        initialCard={editingCard}
        submitting={submitting}
        errorMessage={formError}
        onClose={() => setPanelOpen(false)}
        onSubmit={handleSubmit}
      />
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
  addButton: {
    padding: "12px 20px",
    borderRadius: radius.md,
    border: "none",
    background: colors.gold,
    color: colors.ink,
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginBottom: "24px",
  },
  statCard: {
    background: colors.card,
    borderRadius: radius.lg,
    boxShadow: shadow.tile,
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: "24px",
    fontWeight: 600,
    color: colors.ink,
  },
  statLabel: {
    fontSize: "12px",
    color: colors.inkMuted,
  },
  errorBanner: {
    fontSize: "13px",
    color: "#fff",
    background: colors.rubyStrong,
    borderRadius: radius.md,
    padding: "12px 16px",
    marginBottom: "20px",
  },
};
