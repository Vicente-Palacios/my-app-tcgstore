import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";
import type { Card, CardInput } from "./types";
import { createCard, deleteCard, fetchCards, updateCard } from "./api/cardsApi";
import AuthShell from "./components/AuthShell";
import { LoginError, LoginLoading, LoginPanel } from "./components/LoginPanel";
import TopBar from "./components/TopBar";
import CardGrid from "./components/CardGrid";
import CardFormPanel from "./components/CardFormPanel";
import { colors, fonts, radius } from "./theme";

function App() {
  const auth = useAuth();

  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const roles = (auth.user?.profile["cognito:groups"] as string[]) || [];
  const canEdit = roles.includes("Admin") || roles.includes("Colaborador");
  const canDelete = roles.includes("Admin");
  const token = auth.user?.id_token;

  useEffect(() => {
    if (!auth.isAuthenticated || !token) return;

    setLoadingCards(true);
    setLoadError(null);

    fetchCards(token)
      .then(setCards)
      .catch((error: Error) => setLoadError(error.message))
      .finally(() => setLoadingCards(false));
  }, [auth.isAuthenticated, token]);

  if (auth.isLoading) {
    return (
      <AuthShell>
        <LoginLoading />
      </AuthShell>
    );
  }

  if (auth.error) {
    return (
      <AuthShell>
        <LoginError
          message={auth.error.message}
          onRetry={() => auth.signinRedirect()}
        />
      </AuthShell>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <AuthShell>
        <LoginPanel onSignIn={() => auth.signinRedirect()} />
      </AuthShell>
    );
  }

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
    if (!token) return;
    setSubmitting(true);
    setFormError(null);

    try {
      if (editingCard) {
        const updated = await updateCard(token, editingCard.id, data);
        setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await createCard(token, data);
        setCards((prev) => [...prev, created]);
      }
      setPanelOpen(false);
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(card: Card) {
    if (!token) return;
    const previous = cards;
    // Actualización optimista: la quitamos de la vista y revertimos si falla
    setCards((prev) => prev.filter((c) => c.id !== card.id));

    try {
      await deleteCard(token, card.id);
    } catch (error) {
      setCards(previous);
      setLoadError((error as Error).message);
    }
  }

  const email = auth.user?.profile.email as string | undefined;

  return (
    <div style={styles.page}>
      <TopBar email={email} roles={roles} onLogout={() => auth.removeUser()} />

      <main style={styles.main}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.pageTitle}>Inventario de cartas</h1>
            <p style={styles.pageSubtitle}>
              {loadingCards
                ? "Cargando catálogo…"
                : `${cards.length} ${cards.length === 1 ? "carta registrada" : "cartas registradas"}`}
            </p>
          </div>
          {canEdit && (
            <button style={styles.addButton} onClick={openCreatePanel}>
              Nueva carta
            </button>
          )}
        </div>

        {!canEdit && (
          <p style={styles.readOnlyNote}>
            Tu cuenta tiene acceso de solo lectura. Pide a un Admin o
            Colaborador que te asigne permisos de edición.
          </p>
        )}

        {loadError && <p style={styles.errorBanner}>{loadError}</p>}

        <CardGrid
          cards={cards}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={openEditPanel}
          onDelete={handleDelete}
        />
      </main>

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
  page: {
    minHeight: "100vh",
    background: colors.mat,
    fontFamily: fonts.body,
  },
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "36px 32px 64px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "14px",
  },
  pageTitle: {
    fontFamily: fonts.display,
    fontSize: "28px",
    color: colors.onMat,
    margin: "0 0 4px",
    fontWeight: 600,
  },
  pageSubtitle: {
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
  readOnlyNote: {
    fontSize: "13px",
    color: colors.onMatMuted,
    background: "rgba(244, 241, 228, 0.06)",
    border: `1px solid ${colors.matLine}`,
    borderRadius: radius.md,
    padding: "12px 16px",
    marginBottom: "20px",
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

export default App;
