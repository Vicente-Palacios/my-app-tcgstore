import { Navigate, Outlet } from "react-router-dom";
import { useUserRoles } from "../hooks/useUserRoles";

interface ProtectedRouteProps {
  // Si se omite, solo exige estar autenticado (ya lo garantiza el árbol superior).
  // Si se pasa, el usuario debe tener AL MENOS uno de estos roles.
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { roles } = useUserRoles();

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.some((role) => roles.includes(role));
    if (!hasAccess) {
      return <Navigate to="/no-autorizado" replace />;
    }
  }

  return <Outlet />;
}
