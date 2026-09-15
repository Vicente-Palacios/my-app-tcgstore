// Identidad visual propia de TCG Store: fieltro de playmat + cartulina + foil.
// A propósito distinta de la paleta azul/blanco tipo SaaS del proyecto de referencia.

export const colors = {
  mat: "#1E3A34", // verde fieltro, como el tapete donde se juegan las partidas
  matDeep: "#142B26", // variante más oscura para header/footer
  matLine: "#2E4E46", // líneas y bordes sobre el fieltro

  card: "#F8F4E9", // cartulina clara, como el dorso de una carta
  cardAlt: "#F1EAD6",
  cardBorder: "#DED0A6",

  ink: "#221E14", // texto principal sobre cartulina
  inkMuted: "#746A54",

  onMat: "#F4F1E4", // texto principal sobre fieltro
  onMatMuted: "#AABDB5",

  gold: "#C79A3D", // foil dorado — acción primaria
  goldStrong: "#AD8130",
  goldSoft: "rgba(199, 154, 61, 0.16)",

  ruby: "#A23B4B", // acción destructiva
  rubyStrong: "#88303E",
  rubySoft: "rgba(162, 59, 75, 0.12)",
} as const;

// Colores de acento por rareza — un mismo código visual que ya usan
// las tiendas de cartas físicas para clasificar el inventario.
export function rarityAccent(rarity: string): string {
  const key = rarity.trim().toLowerCase();
  if (key.includes("secreta") || key.includes("secret")) {
    return "linear-gradient(135deg, #C79A3D 0%, #C9447A 50%, #3E6FB0 100%)";
  }
  if (key.includes("ultra")) return "#7A4FB5";
  if (key.includes("rara") || key.includes("rare")) return "#3E6FB0";
  if (key.includes("infrecuente") || key.includes("uncommon")) return "#4C8C5B";
  return "#8B8F87"; // común / sin clasificar
}

export const fonts = {
  display: '"Fraunces", Georgia, "Times New Roman", serif',
  body: '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
} as const;

export const radius = { sm: 6, md: 10, lg: 18, pill: 999 } as const;

export const shadow = {
  soft: "0 20px 40px -20px rgba(15, 25, 20, 0.5)",
  tile: "0 10px 24px -14px rgba(15, 25, 20, 0.4)",
} as const;
