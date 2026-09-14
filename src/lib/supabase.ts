import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Descarta valores ausentes, vazios ou só com espaços.
 *
 * Uma variável definida como string vazia na Vercel é truthy para `??` e
 * chega até `createClient()`, que lança "Invalid supabaseUrl". Melhor tratar
 * como não configurada e deixar o site cair no conteúdo local.
 */
function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

// Acesso estático de propriedade: é assim que o Next substitui NEXT_PUBLIC_* no cliente.
const url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
const anonKey = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const serviceKey = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);

/** true quando as variáveis do Supabase estão configuradas e a URL é válida. */
export const supabaseConfigured = Boolean(url && anonKey && isValidUrl(url));

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    console.warn(`[supabase] NEXT_PUBLIC_SUPABASE_URL inválida: "${value}" — usando /content.`);
    return false;
  }
}

/** Cliente de leitura pública (respeita RLS). Null se não configurado. */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured || !url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/**
 * Cliente com service role — ignora RLS.
 * Use SOMENTE em Route Handlers / Server Actions, nunca em componente cliente.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey || !isValidUrl(url)) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
