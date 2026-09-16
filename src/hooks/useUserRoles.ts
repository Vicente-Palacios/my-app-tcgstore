import { useAuth } from "react-oidc-context";

export interface UserRoles {
  roles: string[];
  isAdmin: boolean;
  isColaborador: boolean;
  isCliente: boolean;
  // Puede editar cartas (crear/actualizar), igual que exige el backend con @PreAuthorize
  canEdit: boolean;
  // Puede eliminar cartas, igual que exige el backend con @PreAuthorize
  canDelete: boolean;
  email?: string;
}

export function useUserRoles(): UserRoles {
  const auth = useAuth();
  const roles = (auth.user?.profile["cognito:groups"] as string[]) || [];
  const isAdmin = roles.includes("Admin");
  const isColaborador = roles.includes("Colaborador");
  const isCliente = roles.includes("Cliente");

  return {
    roles,
    isAdmin,
    isColaborador,
    isCliente,
    canEdit: isAdmin || isColaborador,
    canDelete: isAdmin,
    email: auth.user?.profile.email as string | undefined,
  };
}
