import { useState } from "react";
import { useCards } from "../context/CardsContext";
import { useUserRoles } from "../hooks/useUserRoles";
import CardGrid from "../components/CardGrid";
import CardFormPanel from "../components/CardFormPanel";
import type { Card, CardInput } from "../types";
import { colors, fonts, radius } from "../theme";

export default function InventoryPage() {
  const { cards, loading, error, create, update, remove } = useCards();
  const { isAdmin } = useUserRoles();

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
      // El contexto ya revierte el estado optimista; no hace falta más aquí.
    }
  }

  return (
    <div>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Inventario</h1>
          <p style={styles.subtitle}>
            {loading
              ? "Cargando catálogo…"
              : `${cards.length} ${cards.length === 1 ? "carta registrada" : "cartas registradas"}`}
          </p>
        </div>
        <button style={styles.addButton} onClick={openCreatePanel}>
          Nueva carta
        </button>
      </div>

      {error && <p style={styles.errorBanner}>{error}</p>}

      <CardGrid
        cards={cards}
        canEdit
        canDelete={isAdmin}
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
  errorBanner: {
    fontSize: "13px",
    color: "#fff",
    background: colors.rubyStrong,
    borderRadius: radius.md,
    padding: "12px 16px",
    marginBottom: "20px",
  },
};
