import { useEffect, useState } from "react";
import type { Card, CardInput } from "../types";
import { CONDITIONS, GAMES, RARITIES } from "../types";
import { colors, fonts, radius, shadow } from "../theme";

interface CardFormPanelProps {
  open: boolean;
  initialCard: Card | null; // null = modo creación
  submitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (data: CardInput) => void;
}

const emptyForm: CardInput = {
  name: "",
  game: GAMES[0],
  setName: "",
  rarity: RARITIES[0],
  condition: CONDITIONS[1],
  price: 0,
  stock: 0,
};

export default function CardFormPanel({
  open,
  initialCard,
  submitting,
  errorMessage,
  onClose,
  onSubmit,
}: CardFormPanelProps) {
  const [form, setForm] = useState<CardInput>(emptyForm);

  useEffect(() => {
    if (initialCard) {
      const { id: _id, ...rest } = initialCard;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
  }, [initialCard, open]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const isEditing = initialCard !== null;

  function update<K extends keyof CardInput>(key: K, value: CardInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <aside style={styles.panel} onClick={(event) => event.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {isEditing ? "Editar carta" : "Nueva carta"}
          </h2>
          <button style={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label}>
            Nombre
            <input
              style={styles.input}
              type="text"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ej: Charizard, Black Lotus…"
            />
          </label>

          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1 }}>
              Juego
              <select
                style={styles.input}
                value={form.game}
                onChange={(e) => update("game", e.target.value)}
              >
                {GAMES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ ...styles.label, flex: 1 }}>
              Rareza
              <select
                style={styles.input}
                value={form.rarity}
                onChange={(e) => update("rarity", e.target.value)}
              >
                {RARITIES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label style={styles.label}>
            Edición / set
            <input
              style={styles.input}
              type="text"
              required
              value={form.setName}
              onChange={(e) => update("setName", e.target.value)}
              placeholder="Ej: Base Set, Alpha…"
            />
          </label>

          <label style={styles.label}>
            Condición
            <select
              style={styles.input}
              value={form.condition}
              onChange={(e) => update("condition", e.target.value)}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1 }}>
              Precio (USD)
              <input
                style={styles.input}
                type="number"
                min={0}
                step="0.01"
                required
                value={form.price}
                onChange={(e) => update("price", Number(e.target.value))}
              />
            </label>

            <label style={{ ...styles.label, flex: 1 }}>
              Stock
              <input
                style={styles.input}
                type="number"
                min={0}
                step="1"
                required
                value={form.stock}
                onChange={(e) => update("stock", Number(e.target.value))}
              />
            </label>
          </div>

          {errorMessage && <p style={styles.error}>{errorMessage}</p>}

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button type="submit" style={styles.saveButton} disabled={submitting}>
              {submitting ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear carta"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(20, 26, 22, 0.45)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 50,
  },
  panel: {
    width: "min(420px, 100%)",
    height: "100%",
    background: colors.card,
    boxShadow: shadow.soft,
    padding: "32px",
    overflowY: "auto",
    boxSizing: "border-box",
    fontFamily: fonts.body,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontFamily: fonts.display,
    fontSize: "22px",
    fontWeight: 600,
    color: colors.ink,
    margin: 0,
  },
  closeButton: {
    background: "transparent",
    border: "none",
    fontSize: "16px",
    color: colors.inkMuted,
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  row: {
    display: "flex",
    gap: "14px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "12px",
    color: colors.inkMuted,
    fontWeight: 600,
  },
  input: {
    padding: "10px 12px",
    borderRadius: radius.md,
    border: `1px solid ${colors.cardBorder}`,
    fontSize: "14px",
    fontFamily: fonts.body,
    color: colors.ink,
    background: "#fff",
  },
  error: {
    fontSize: "13px",
    color: colors.ruby,
    margin: 0,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "8px",
  },
  cancelButton: {
    padding: "11px 18px",
    borderRadius: radius.md,
    border: `1px solid ${colors.cardBorder}`,
    background: "transparent",
    color: colors.inkMuted,
    cursor: "pointer",
    fontSize: "13px",
  },
  saveButton: {
    padding: "11px 20px",
    borderRadius: radius.md,
    border: "none",
    background: colors.gold,
    color: colors.ink,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
  },
};
