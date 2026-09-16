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
2. No **SQL Editor**, cole e execute `supabase/Executado/schema.sql` — na primeira vez
   isso cria as tabelas, os índices e as políticas de RLS. (Sobre a pasta, veja a
   convenção logo abaixo.)
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

### Convenção da pasta `supabase/`

- **`supabase/*.sql`** — SQL novo, ainda **não** rodado contra o banco de produção.
  Sempre que uma alteração de schema for necessária, o arquivo entra aqui primeiro
  para revisão.
- **`supabase/Executado/*.sql`** — SQL que já foi colado e rodado no SQL Editor do
  Supabase. Depois de rodar um arquivo, mova-o para esta pasta — é o jeito que o
  projeto usa para saber, só de olhar, o que já foi aplicado ao banco real.

### Sobre segurança

- `SUPABASE_SERVICE_ROLE_KEY` **nunca** pode receber o prefixo `NEXT_PUBLIC_`.
  Ela ignora RLS e só é usada em Route Handlers (`src/app/api/`).
- A tabela `leads` guarda dado pessoal e **não tem política de `select`**. Nem
  mesmo com a chave anon vazada é possível ler mensagens dos formulários.
- Conteúdo institucional tem leitura pública; escrita só pelo painel ou pela
  service role.

---

## Painel administrativo (`/admin`)

A equipe da SBE edita notícias, rede credenciada, serviços, diretoria, planos,
FAQ, depoimentos e as mensagens recebidas do site direto pelo navegador, sem
mexer em código. Precisa do Supabase configurado (seção acima) — sem ele o
painel abre, mas nenhuma tela consegue ler ou gravar dado nenhum.

### Configurar o acesso

Duas variáveis, sem tabela de usuários nem cadastro:

```env
# "usuario1:senha1,usuario2:senha2" — uma pessoa a mais é só uma vírgula a mais
ADMIN_USERS=admin:uma-senha-forte-aqui

# assina o cookie de sessão — gere com `openssl rand -hex 32`
ADMIN_SESSION_SECRET=<64 caracteres aleatórios>
```

Sem `ADMIN_SESSION_SECRET` definido (ou curto demais), o login recusa entrar
em vez de usar um segredo fraco por padrão.

### O que dá para gerenciar

| Seção | Tabela | Chave |
|---|---|---|
| Notícias | `posts` | slug |
| Rede credenciada | `providers` | slug |
| Serviços | `services` | slug |
| Diretoria | `leaders` | id |
| Planos de associação | `membership_plans` | slug |
| Perguntas frequentes | `faq` | id |
| Depoimentos | `testimonials` | id |
| Mensagens recebidas | `leads` | id (só leitura + marcar atendida/excluir) |
| Auditoria | `audit_log` | — (somente leitura) |

As notícias têm editor de Markdown com prévia ao vivo (`content_md` guarda a
fonte; `content` guarda o HTML já renderizado, que é o que o site público lê —
a conversão acontece uma vez, ao salvar, não a cada visita).

Cada criação, edição e exclusão fica registrada em **Auditoria**
(`/admin/auditoria`), com quem fez, quando, o quê e os valores gravados —
filtrável por recurso e por tipo de ação.

### Como funciona por baixo

- **Sessão:** um cookie HTTP-only assinado com HMAC-SHA256 (Web Crypto API,
  não Supabase Auth) — simples de propósito, dado que é uma equipe pequena
  entrando ocasionalmente. `src/lib/admin/session.ts`.
- **Proteção de rota:** `src/middleware.ts` barra qualquer `/admin/**` sem
  sessão válida, preservando a URL de destino para depois do login.
- **Escrita:** Server Actions usando a service role do Supabase (ignora RLS
  deliberadamente — o controle de acesso é "está logado no painel", não uma
  política de banco por linha).
- **Logout é uma rota comum (`/api/admin/logout`), não uma Server Action.**
  Isso não é estético: no Next.js 16.3.5, ter uma Server Action no layout
  compartilhado (logout) e OUTRA na página (criar/editar/excluir) fazia o
  navegador enviar o ID de referência errado — a sessão era encerrada no meio
  de qualquer criação ou edição normal. Tirar o logout do mecanismo de Server
  Actions elimina a colisão. Novas páginas do painel podem usar Server Actions
  à vontade; o que não deve voltar é uma **segunda função de Server Action
  diferente vivendo no layout**.

---

## Deploy na Vercel

1. Conecte o repositório na Vercel — o Next.js é detectado automaticamente.
2. Em *Settings → Environment Variables*, adicione as variáveis do
   `.env.example` — Supabase, `NEXT_PUBLIC_SITE_URL=https://sbecuiaba.com.br`
   e as duas do painel administrativo (`ADMIN_USERS`, `ADMIN_SESSION_SECRET`).
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
  middleware.ts           protege as rotas /admin/**
  app/                    rotas (App Router)
    admin/
      login/              tela de login (fora do layout protegido)
      (protected)/        layout com sidebar — dashboard e um diretório por recurso
        rede-credenciada/ servicos/ diretoria/ planos/ faq/ depoimentos/
        noticias/         editor de Markdown com prévia ao vivo
        mensagens/        caixa de entrada dos formulários (leads)
        auditoria/        histórico de criação/edição/exclusão
    api/pix/              gera o BR Code e o QR de doação
    api/contato/          recebe os formulários e grava em `leads`
    api/admin/logout/     encerra a sessão do painel (rota comum, não Server Action)
    opengraph-image.tsx   imagem de compartilhamento gerada em build
  components/
    layout/               cabeçalho, rodapé, logo, hero de página
    ui/                   botão, container, seção, ícones, acordeão, trilha
    home/                 blocos da página inicial
    rede/                 busca e cartões da rede credenciada
    doe/                  caixa de doação PIX
    forms/                formulário de contato reutilizável
    common/               WhatsApp, cookies, JSON-LD
    admin/                campos de formulário, editor de Markdown, exclusão com confirmação
  lib/
    site.ts               dados da instituição (fonte única)
    nav.ts                menus
    pix.ts                gerador de BR Code (EMV + CRC16)
    markdown.ts           Markdown → HTML, usado pelo conteúdo local e pelo painel
    content/              adaptadores de conteúdo
    admin/                sessão do painel e log de auditoria
supabase/Executado/schema.sql  esquema e RLS (nome da pasta: convenção própria do projeto)
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
