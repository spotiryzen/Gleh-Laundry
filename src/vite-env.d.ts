interface ImportMetaEnv {
  readonly VITE_N8N_WEBHOOK_URL?: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css' {
  const styles: Record<string, string>;
  export default styles;
}
