import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export type LeadKind = "contato" | "voluntariado" | "associado" | "credenciamento";

const KINDS: LeadKind[] = ["contato", "voluntariado", "associado", "credenciamento"];

interface LeadPayload {
  kind: LeadKind;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message?: string;
  /** Campo-isca invisível: só robôs preenchem. */
  website?: string;
}

function validate(body: Partial<LeadPayload>): { ok: true; data: LeadPayload } | { ok: false; error: string } {
  if (body.website) return { ok: false, error: "spam" };

  const kind = KINDS.includes(body.kind as LeadKind) ? (body.kind as LeadKind) : "contato";
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (name.length < 2) return { ok: false, error: "Informe seu nome completo." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, error: "Informe um e-mail válido." };
  if (phone.replace(/\D/g, "").length < 10) return { ok: false, error: "Informe um telefone com DDD." };

  return {
    ok: true,
    data: {
      kind,
      name: name.slice(0, 160),
      email: email.slice(0, 160),
      phone: phone.slice(0, 32),
      subject: String(body.subject ?? "").trim().slice(0, 160) || undefined,
      message: String(body.message ?? "").trim().slice(0, 4000) || undefined,
    },
  };
}

export async function POST(request: Request) {
  let body: Partial<LeadPayload>;
  try {
    body = (await request.json()) as Partial<LeadPayload>;
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    // Robôs recebem 200 para não aprenderem que foram detectados.
    if (result.error === "spam") return NextResponse.json({ ok: true });
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const db = getSupabaseAdmin();

  if (!db) {
    // Sem Supabase configurado o site continua utilizável: a mensagem é
    // registrada no log do servidor e o usuário é orientado ao WhatsApp.
    console.warn("[leads] Supabase não configurado — mensagem não persistida:", result.data);
    return NextResponse.json({
      ok: true,
      persisted: false,
      notice: "Recebemos seu contato. Se preferir retorno imediato, fale conosco pelo WhatsApp.",
    });
  }

  const { error } = await db.from("leads").insert({
    kind: result.data.kind,
    name: result.data.name,
    email: result.data.email,
    phone: result.data.phone,
    subject: result.data.subject,
    message: result.data.message,
  });

  if (error) {
    console.error("[leads] falha ao gravar no Supabase:", error.message);
    return NextResponse.json(
      { error: "Não conseguimos registrar sua mensagem agora. Tente pelo WhatsApp." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, persisted: true });
}
