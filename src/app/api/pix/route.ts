import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { buildPixPayload } from "@/lib/pix";
import { site } from "@/lib/site";

/**
 * Gera o BR Code (PIX copia-e-cola) e o QR Code correspondente.
 *
 * Roda no servidor para que a biblioteca de QR não vá para o bundle do
 * cliente e para manter a montagem do payload em um único lugar.
 */
export async function POST(request: Request) {
  let amount: number | undefined;

  try {
    const body = (await request.json()) as { amount?: unknown };
    if (typeof body.amount === "number" && Number.isFinite(body.amount) && body.amount > 0) {
      // Teto defensivo: o PIX limita o campo de valor a 13 caracteres.
      amount = Math.min(Math.round(body.amount * 100) / 100, 999_999.99);
    }
  } catch {
    // Corpo ausente ou inválido: gera um PIX de valor livre.
  }

  const payload = buildPixPayload({
    key: site.pixKey,
    merchantName: "Soc Benef Evangelica",
    merchantCity: site.address.city,
    amount,
    txid: "DOACAOSITE",
  });

  const qrDataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 352,
    color: { dark: "#0b3b46", light: "#ffffff" },
  });

  return NextResponse.json({ payload, qrDataUrl });
}
