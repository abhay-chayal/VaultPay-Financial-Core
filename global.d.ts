// Global type declarations for VaultPay Financial Core

// Allow CSS imports in TypeScript files
declare module '*.css' {
  const styles: { [className: string]: string };
  export default styles;
}

// Allow SVG imports
declare module '*.svg' {
  const content: string;
  export default content;
}
