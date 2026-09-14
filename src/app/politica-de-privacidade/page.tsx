import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { site, fullAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Como a Sociedade Beneficente Evangélica coleta, usa e protege dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default function PoliticaPage() {
  return (
    <>
      <PageHero
        eyebrow="LGPD"
        title="Política de privacidade"
        description="Como tratamos os dados pessoais de quem usa este site e de quem é atendido pela instituição."
      />
      <Breadcrumbs items={[{ label: "Política de privacidade" }]} />

      <div className="py-14 sm:py-18">
        <Container size="narrow">
          <div className="rich-text">
            <p className="text-sm text-ink-mute">
              Última atualização: {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}.
            </p>

            <p>
              A <strong>{site.legalName}</strong> ({site.name}), inscrita no CNPJ {site.cnpj},
              com sede em {fullAddress}, é a controladora dos dados pessoais tratados neste site,
              nos termos da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados — LGPD).
            </p>

            <h2>1. Quais dados coletamos</h2>
            <ul>
              <li>
                <strong>Dados que você informa:</strong> nome, e-mail, telefone, assunto e mensagem,
                quando você preenche um formulário de contato, voluntariado ou associação.
              </li>
              <li>
                <strong>Dados de navegação:</strong> páginas visitadas, tempo de permanência,
                origem do acesso e tipo de dispositivo, coletados apenas mediante seu consentimento
                no aviso de cookies.
              </li>
            </ul>
            <p>
              Não coletamos dados sensíveis de saúde por meio deste site. Informações clínicas são
              tratadas presencialmente, no âmbito do atendimento, com o sigilo próprio da relação
              profissional.
            </p>

            <h2>2. Para que usamos</h2>
            <ul>
              <li>Responder às solicitações enviadas pelos formulários;</li>
              <li>Realizar o agendamento e o acompanhamento de atendimentos;</li>
              <li>Processar cadastros de associados, voluntários e credenciados;</li>
              <li>Emitir recibos de doação, quando solicitado;</li>
              <li>Entender o uso do site e melhorar a informação oferecida.</li>
            </ul>

            <h2>3. Base legal</h2>
            <p>
              O tratamento se apoia no consentimento (art. 7º, I), na execução de procedimentos
              preliminares a contrato a seu pedido (art. 7º, V), no cumprimento de obrigação legal
              ou regulatória (art. 7º, II) e no legítimo interesse da instituição para o
              atendimento de sua finalidade estatutária (art. 7º, IX).
            </p>

            <h2>4. Compartilhamento</h2>
            <p>
              Não vendemos nem cedemos dados pessoais. O compartilhamento ocorre apenas:
            </p>
            <ul>
              <li>
                com clínicas e laboratórios da rede credenciada, quando necessário para viabilizar
                o atendimento que você solicitou;
              </li>
              <li>
                com fornecedores de tecnologia que hospedam o site e armazenam os dados, sob
                contrato e obrigação de confidencialidade;
              </li>
              <li>
                com autoridades públicas, quando houver determinação legal ou judicial.
              </li>
            </ul>

            <h2>5. Por quanto tempo guardamos</h2>
            <p>
              Mensagens de contato são mantidas por até 24 meses. Dados de associados e voluntários
              permanecem enquanto durar o vínculo e pelo prazo legal subsequente. Registros
              contábeis e fiscais seguem os prazos exigidos pela legislação.
            </p>

            <h2>6. Seus direitos</h2>
            <p>
              Você pode, a qualquer momento, solicitar confirmação da existência de tratamento,
              acesso, correção, anonimização, portabilidade ou eliminação dos seus dados, além de
              revogar o consentimento dado. Basta escrever para{" "}
              <a href={`mailto:${site.email.general}`}>{site.email.general}</a>. Respondemos em até
              15 dias.
            </p>

            <h2>7. Cookies</h2>
            <p>
              Cookies essenciais mantêm o site funcionando e não podem ser desativados. Cookies de
              medição de audiência só são ativados se você aceitar no aviso exibido no primeiro
              acesso. Você pode rever a escolha a qualquer momento limpando os dados do site no seu
              navegador.
            </p>

            <h2>8. Segurança</h2>
            <p>
              O site trafega sob HTTPS com certificado digital válido. Os dados enviados por
              formulário são armazenados em banco de dados com controle de acesso restrito à equipe
              autorizada da instituição.
            </p>

            <h2>9. Alterações</h2>
            <p>
              Esta política pode ser atualizada. Mudanças relevantes serão comunicadas nesta página,
              com a data de atualização no topo.
            </p>

            <h2>10. Contato do responsável</h2>
            <p>
              Dúvidas sobre esta política ou sobre o tratamento dos seus dados:{" "}
              <a href={`mailto:${site.email.general}`}>{site.email.general}</a> ou{" "}
              <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>.
            </p>
          </div>
        </Container>
      </div>
    </>
  );
}
