import { useMemo, useState } from "react";
import type { Card } from "../types";
import CardTile from "./CardTile";
import { colors, fonts, radius } from "../theme";

interface CardGridProps {
  cards: Card[];
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
}

export default function CardGrid({
  cards,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: CardGridProps) {
  const [search, setSearch] = useState("");
  const [gameFilter, setGameFilter] = useState<string>("Todos");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const games = useMemo(() => {
    const unique = Array.from(new Set(cards.map((c) => c.game))).filter(Boolean);
    return ["Todos", ...unique];
  }, [cards]);

  const filtered = useMemo(() => {
    return cards.filter((card) => {
      const matchesGame = gameFilter === "Todos" || card.game === gameFilter;
      const matchesSearch =
        search.trim() === "" ||
        card.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        card.setName.toLowerCase().includes(search.trim().toLowerCase());
      return matchesGame && matchesSearch;
    });
  }, [cards, search, gameFilter]);

  return (
    <div>
      <div style={styles.toolbar}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Buscar por nombre o edición…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          style={styles.filterSelect}
          value={gameFilter}
          onChange={(event) => setGameFilter(event.target.value)}
        >
          {games.map((game) => (
            <option key={game} value={game}>
              {game}
            </option>
          ))}
        </select>
        <span style={styles.countLabel}>
          {filtered.length} {filtered.length === 1 ? "carta" : "cartas"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyTitle}>Sin resultados</p>
          <p style={styles.emptyBody}>
            {cards.length === 0
              ? "Todavía no hay cartas cargadas en el inventario."
              : "Ninguna carta coincide con tu búsqueda o filtro."}
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((card) => (
            <CardTile
              key={card.id}
              card={card}
              canEdit={canEdit}
              canDelete={canDelete}
              isConfirmingDelete={confirmingId === card.id}
              onEdit={() => onEdit(card)}
              onRequestDelete={() => setConfirmingId(card.id)}
              onCancelDelete={() => setConfirmingId(null)}
              onConfirmDelete={() => {
                setConfirmingId(null);
                onDelete(card);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "22px",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: "1 1 240px",
    padding: "10px 14px",
    borderRadius: radius.md,
    border: `1px solid ${colors.cardBorder}`,
    fontSize: "13px",
    fontFamily: fonts.body,
    background: colors.card,
    color: colors.ink,
  },
  filterSelect: {
    padding: "10px 14px",
    borderRadius: radius.md,
    border: `1px solid ${colors.cardBorder}`,
    fontSize: "13px",
    fontFamily: fonts.body,
    background: colors.card,
    color: colors.ink,
  },
  countLabel: {
    fontSize: "12px",
    color: colors.onMatMuted,
    marginLeft: "auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "18px",
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
};
