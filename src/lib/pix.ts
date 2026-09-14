/**
 * Gerador de BR Code (PIX copia-e-cola), padrão EMV® QRCPS-MPM do Banco Central.
 *
 * O site antigo exibia apenas a chave PIX solta para o doador digitar à mão.
 * Aqui o payload completo é montado no servidor, com valor opcional e
 * identificador da campanha, pronto para copiar ou virar QR Code.
 */

/** Monta um campo TLV: ID (2 dígitos) + tamanho (2 dígitos) + valor. */
function tlv(id: string, value: string): string {
  return id + String(value.length).padStart(2, "0") + value;
}

/** CRC16/CCITT-FALSE — polinômio 0x1021, valor inicial 0xFFFF. */
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Os campos de texto do BR Code devem ser ASCII sem acentos.
 * A caixa original é preservada — o padrão não exige maiúsculas e o nome do
 * recebedor aparece exatamente assim na tela do app do banco.
 */
function sanitize(text: string, maxLength: number): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .slice(0, maxLength);
}

export interface PixParams {
  key: string;
  merchantName: string;
  merchantCity: string;
  /** Em reais. Omitir deixa o doador escolher o valor no app do banco. */
  amount?: number;
  /** Identificador da transação — útil para rastrear campanhas. Máx. 25 caracteres. */
  txid?: string;
  /** Descrição curta exibida por alguns bancos. */
  description?: string;
}

export function buildPixPayload({
  key,
  merchantName,
  merchantCity,
  amount,
  txid = "***",
  description,
}: PixParams): string {
  const merchantAccount =
    tlv("00", "br.gov.bcb.pix") +
    tlv("01", key) +
    (description ? tlv("02", sanitize(description, 72)) : "");

  const payload =
    tlv("00", "01") +                                  // formato do payload
    tlv("26", merchantAccount) +                       // conta do recebedor
    tlv("52", "0000") +                                // categoria do estabelecimento
    tlv("53", "986") +                                 // moeda: BRL
    (amount ? tlv("54", amount.toFixed(2)) : "") +     // valor
    tlv("58", "BR") +                                  // país
    tlv("59", sanitize(merchantName, 25)) +
    tlv("60", sanitize(merchantCity, 15)) +
    tlv("62", tlv("05", sanitize(txid, 25) || "***")) +
    "6304";                                            // cabeçalho do CRC

  return payload + crc16(payload);
}
