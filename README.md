# SBE — Sociedade Beneficente Evangélica

Novo site institucional da SBE (Cuiabá/MT), em substituição ao WordPress em
`sbecuiaba.com.br`.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript ·
Supabase (Postgres) · deploy na Vercel.

---

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # opcional — o site roda sem nenhuma variável
npm run dev                  # http://localhost:3000
```

Sem variáveis de ambiente o site funciona por completo, lendo o conteúdo dos
arquivos em `content/`. O Supabase só é necessário para persistir formulários e
para a equipe editar conteúdo pelo painel.

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run typecheck` | Verificação de tipos |
| `npm run seed` | Carrega `content/` para o Supabase |

---

## Onde fica o conteúdo

O site lê o conteúdo através de uma camada de adaptadores
(`src/lib/content/`). A origem é escolhida pela variável `CONTENT_SOURCE`:

- **`local`** (padrão) — arquivos em `content/`, versionados no Git.
- **`supabase`** — tabelas do Postgres. Cada consulta cai de volta no arquivo
  local se a tabela ainda estiver vazia, então a migração pode ser feita **uma
  tabela por vez**, sem derrubar o site.

```
content/
  institucional.json      missão, visão, valores, história, diretoria, números
  servicos.json           catálogo de serviços
  rede-credenciada.json   26 clínicas e laboratórios credenciados
  associado.json          planos de associação
  transparencia.json      documentos e destinação dos recursos
  faq.json                perguntas frequentes
  depoimentos.json        depoimentos
  noticias/*.md           notícias em Markdown com frontmatter
```

Dados de contato, endereço, horários, redes sociais e chave PIX ficam em
**`src/lib/site.ts`** — um único lugar para alterar.

---

## Configurando o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, cole e execute `supabase/schema.sql`. Isso cria as tabelas,
   os índices e as políticas de RLS.
3. Copie as chaves em *Project Settings → API* para `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

4. Carregue o conteúdo inicial:

   ```bash
   npm run seed
   ```

5. Quando estiver conferido, mude para `CONTENT_SOURCE=supabase`.

### Sobre segurança

- `SUPABASE_SERVICE_ROLE_KEY` **nunca** pode receber o prefixo `NEXT_PUBLIC_`.
  Ela ignora RLS e só é usada em Route Handlers (`src/app/api/`).
- A tabela `leads` guarda dado pessoal e **não tem política de `select`**. Nem
  mesmo com a chave anon vazada é possível ler mensagens dos formulários.
- Conteúdo institucional tem leitura pública; escrita só pelo painel ou pela
  service role.

---

## Deploy na Vercel

1. Conecte o repositório na Vercel — o Next.js é detectado automaticamente.
2. Em *Settings → Environment Variables*, adicione as quatro variáveis do
   `.env.example`, com `NEXT_PUBLIC_SITE_URL=https://sbecuiaba.com.br`.
3. Aponte o domínio em *Settings → Domains*.

### Migração do WordPress

`next.config.mjs` já define os redirecionamentos 301 das URLs antigas, para não
perder o posicionamento no Google:

| URL antiga | Nova URL |
|---|---|
| `/inicio` | `/` |
| `/institucional` | `/quem-somos` |
| `/servicos-internos` | `/servicos` |
| `/convenio` | `/rede-credenciada` |
| `/como-ajudar` | `/doe` |

Depois do apontamento do domínio, envie o novo `sitemap.xml` pelo Google Search
Console.

---

## Estrutura do projeto

```
src/
  app/                    rotas (App Router)
    api/pix/              gera o BR Code e o QR de doação
    api/contato/          recebe os formulários e grava em `leads`
    opengraph-image.tsx   imagem de compartilhamento gerada em build
  components/
    layout/               cabeçalho, rodapé, logo, hero de página
    ui/                   botão, container, seção, ícones, acordeão, trilha
    home/                 blocos da página inicial
    rede/                 busca e cartões da rede credenciada
    doe/                  caixa de doação PIX
    forms/                formulário de contato reutilizável
    common/               WhatsApp, cookies, JSON-LD
  lib/
    site.ts               dados da instituição (fonte única)
    nav.ts                menus
    pix.ts                gerador de BR Code (EMV + CRC16)
    content/              adaptadores de conteúdo
supabase/schema.sql       esquema e RLS
scripts/seed-supabase.mjs carga do conteúdo para o banco
```

---

## Decisões de implementação

**Doação por PIX.** `src/lib/pix.ts` monta o payload BR Code (padrão EMV
QRCPS-MPM do Banco Central) com CRC16/CCITT-FALSE. O algoritmo foi verificado
contra o valor de conferência canônico do CRC-16/CCITT-FALSE
(`"123456789"` → `0x29B1`) e a estrutura TLV por leitura reversa do payload.
**Antes de publicar, escaneie o QR gerado com um app de banco real e confirme
que o recebedor e o valor aparecem corretos.**

**Ícones e logo em SVG inline.** O site antigo carregava 153 imagens, entre elas
um logotipo PNG de 785 KB. Aqui não há nenhuma requisição de imagem para
elementos de interface.

**Acessibilidade.** Todos os pares de cor texto/fundo foram calculados e passam
em WCAG 2.1 AA. O botão primário usa o âmbar da marca (`#e08a0b`) com texto
petróleo — 5,56:1. Há foco visível, link "pular para o conteúdo", `aria-live` na
busca e o FAQ usa `<details>` nativo, que funciona sem JavaScript.

**Busca da rede no cliente.** Com 26 credenciados, filtrar no navegador é
instantâneo e dispensa ida ao servidor. Se a rede crescer muito, troque o
interior de `NetworkExplorer` por uma consulta paginada ao Supabase — a
interface do componente não precisa mudar.

---

## Pendências antes de publicar

Os arquivos em `content/` marcam com `TODO` e com um campo `_nota` tudo que
precisa ser confirmado pela SBE. O site antigo não trazia esses dados.

- [ ] **CNPJ e ano de fundação** (`src/lib/site.ts`)
- [ ] **História da instituição** — 4 marcos com ano (`institucional.json`)
- [ ] **Nomes da diretoria e conselho fiscal** (`institucional.json`)
- [ ] **Número real de famílias atendidas por ano** (`institucional.json`)
- [ ] **Valores dos planos de associação** (`associado.json`)
- [ ] **PDFs de transparência** em `public/documentos/` — e remover de
      `transparencia.json` os que não existirem
- [ ] **Percentuais reais de destinação dos recursos** (`transparencia.json`)
- [ ] **Depoimentos reais com autorização de uso** (`depoimentos.json`)
- [ ] **Confirmar especialidades, endereços e descontos** de cada credenciado
      (`rede-credenciada.json` — as especialidades foram inferidas do nome)
- [ ] **E-mail `contato@sbecuiaba.com.br`** — confirmar se existe
- [ ] **Escanear o QR do PIX** com um app de banco
- [ ] Substituir as 3 notícias de exemplo por conteúdo real
