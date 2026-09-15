// Coincide con CardResponseDto del backend (cards/dto/CardResponseDto.java)
export interface Card {
  id: string;
  name: string;
  game: string;
  setName: string;
  rarity: string;
  condition: string;
  price: number;
  stock: number;
}

// Coincide con CardRequestDto del backend (cards/dto/CardRequestDto.java)
export type CardInput = Omit<Card, "id">;

// Sugerencias para los formularios; el backend acepta cualquier texto,
// así que no son un enum estricto, solo opciones cómodas para el usuario.
export const GAMES = [
  "Pokémon",
  "Magic: The Gathering",
  "Yu-Gi-Oh!",
  "Digimon",
  "One Piece Card Game",
  "Otro",
] as const;

export const RARITIES = [
  "Común",
  "Infrecuente",
  "Rara",
  "Ultra Rara",
  "Secreta",
] as const;

export const CONDITIONS = [
  "Mint",
  "Near Mint",
  "Excelente",
  "Jugada",
  "Dañada",
] as const;
