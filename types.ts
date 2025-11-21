
export interface Color {
  name: string;
  hex: string;
}

export type Formula = Record<string, number>;

export type Unit = 'g' | 'ml';

export type GlassThickness = 3 | 4 | 5 | 6 | 8 | 10;
