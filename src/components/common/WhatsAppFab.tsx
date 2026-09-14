import { Icon } from "@/components/ui/Icon";
import { whatsappLink } from "@/lib/site";

/** Botão flutuante de WhatsApp — principal canal de contato da SBE. */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="flutuante fixed right-4 bottom-4 z-40 flex items-center gap-2.5 rounded-full bg-[#25d366] py-3.5 pr-5 pl-4 font-semibold text-[#053d21] shadow-lg shadow-black/20 transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <Icon name="whatsapp" className="size-6" />
      <span className="hidden sm:inline">Fale conosco</span>
      <span className="sr-only sm:hidden">Fale conosco pelo WhatsApp</span>
    </a>
  );
}
