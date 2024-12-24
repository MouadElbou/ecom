export interface Product {
  id: number;
  name: string;
  type: 'shirt' | 'pen';
  dimensions: {
    width: number;
    height: number;
  };
  defaultLogoPosition?: {
    x: number;
    y: number;
  };
}
