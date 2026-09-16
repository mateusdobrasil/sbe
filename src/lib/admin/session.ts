/**
 * Sessão do painel administrativo.
 *
 * Implementação própria e enxuta — um cookie assinado com HMAC-SHA256 —
 * em vez de Supabase Auth. Para uma equipe pequena que só precisa entrar
 * ocasionalmente para publicar uma notícia ou atualizar a rede credenciada,
 * criar e gerenciar contas de usuário é complexidade sem retorno; aqui as
 * credenciais são só uma lista em variável de ambiente.
 *
 * Usa a Web Crypto API (crypto.subtle) em vez do módulo `crypto` do Node
 * porque este arquivo roda tanto em Server Actions (runtime Node) quanto
 * no middleware (runtime Edge) — só a Web Crypto API funciona nos dois.
 */

export const SESSION_COOKIE = "sbe_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias
export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET ausente ou curto demais (mínimo 16 caracteres). " +
        "Gere um valor aleatório, por exemplo com `openssl rand -hex 32`.",
    );
  }
  return secret;
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export interface SessionPayload {
  user: string;
  exp: number; // epoch ms
}

/** Assina uma sessão para o usuário informado. Falha se a sessão nunca foi verificada. */
export async function createSessionToken(user: string): Promise<string> {
  const payload: SessionPayload = { user, exp: Date.now() + SESSION_TTL_SECONDS * 1000 };
  const body = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await getKey(getSecret());
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return `${body}.${base64UrlEncode(new Uint8Array(sig))}`;
}

/** Verifica um token de sessão. Retorna null se ausente, inválido, adulterado ou expirado. */
export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  try {
    const key = await getKey(getSecret());
    const valid = await crypto.subtle.verify("HMAC", key, base64UrlDecode(sig), new TextEncoder().encode(body));
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(body))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    // Segredo ausente, token corrompido ou JSON inválido — trata tudo como não autenticado.
    return null;
  }
}

/** Compara duas strings em tempo constante (via digest), para não vazar a senha por timing. */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const va = new Uint8Array(ha);
  const vb = new Uint8Array(hb);
  let diff = va.length === vb.length ? 0 : 1;
  for (let i = 0; i < Math.max(va.length, vb.length); i++) diff |= (va[i] ?? 0) ^ (vb[i] ?? 0);
  return diff === 0;
}

/**
 * Valida usuário e senha contra ADMIN_USERS.
 *
 * Formato: "usuario1:senha1,usuario2:senha2". Sem tabela de usuários, sem
 * fluxo de cadastro — contas são adicionadas trocando essa variável de
 * ambiente na Vercel.
 */
export async function checkCredentials(username: string, password: string): Promise<boolean> {
  const raw = process.env.ADMIN_USERS ?? "";
  const pairs = raw.split(",").map((p) => p.trim()).filter(Boolean);

  for (const pair of pairs) {
    const idx = pair.indexOf(":");
    if (idx === -1) continue;
    const candidateUser = pair.slice(0, idx);
    const candidatePass = pair.slice(idx + 1);
    if (candidateUser === username && (await safeEqual(candidatePass, password))) {
      return true;
    }
  }
  return false;
}
