import { useAuth } from "react-oidc-context";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthShell from "./components/AuthShell";
import { LoginError, LoginLoading, LoginPanel } from "./components/LoginPanel";
import { CardsProvider } from "./context/CardsContext";
import { CartProvider } from "./context/CartContext";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import CatalogPage from "./pages/CatalogPage";
import InventoryPage from "./pages/InventoryPage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";

function App() {
  const auth = useAuth();

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

  return (
    <CardsProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="/catalogo" replace />} />

              {/* Cualquier usuario autenticado puede ver el catálogo */}
              <Route path="/catalogo" element={<CatalogPage />} />

              {/* Solo Admin y Colaborador pueden crear/editar cartas */}
              <Route element={<ProtectedRoute allowedRoles={["Admin", "Colaborador"]} />}>
                <Route path="/inventario" element={<InventoryPage />} />
              </Route>

              {/* Solo Admin tiene control total, incluido eliminar */}
              <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>

              {/* Solo Cliente puede agregar cartas al carrito */}
              <Route element={<ProtectedRoute allowedRoles={["Cliente"]} />}>
                <Route path="/carrito" element={<CartPage />} />
              </Route>

              <Route path="/no-autorizado" element={<NotAuthorizedPage />} />
              <Route path="*" element={<Navigate to="/catalogo" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </CardsProvider>
  );
}

export default App;