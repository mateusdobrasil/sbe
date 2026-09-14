import { supabaseConfigured } from "@/lib/supabase";
import { localAdapter } from "./adapters/local";
import { supabaseAdapter } from "./adapters/supabase";
import type { ContentAdapter } from "./types";

/**
 * Escolhe a origem do conteúdo.
 *
 * CONTENT_SOURCE=supabase usa o banco (com queda para /content por tabela).
 * Qualquer outro valor — ou ausência das chaves — usa os arquivos locais.
 */
const useSupabase =
  process.env.CONTENT_SOURCE === "supabase" && supabaseConfigured;

export const content: ContentAdapter = useSupabase ? supabaseAdapter : localAdapter;

export * from "./types";
