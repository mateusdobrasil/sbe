import { Checkbox, Field, SubmitButton } from "@/components/admin/Field";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

interface PostFormValues {
  slug?: string;
  title?: string;
  excerpt?: string;
  content_md?: string | null;
  date?: string;
  category?: string;
  author?: string | null;
  cover?: string | null;
  published?: boolean | null;
}

export function PostForm({
  post,
  action,
}: {
  post?: PostFormValues;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="mt-6 max-w-3xl space-y-5">
      <Field
        label="Identificador (slug)"
        name="slug"
        defaultValue={post?.slug}
        required
        disabled={!!post}
        hint={post ? "Não pode ser alterado depois de criado." : "Vira parte da URL. Ex.: mutirao-de-exames-2026"}
      />
      <Field label="Título" name="title" defaultValue={post?.title} required />
      <Field
        label="Resumo"
        name="excerpt"
        defaultValue={post?.excerpt}
        textarea
        rows={3}
        hint="Aparece na lista de notícias e ao compartilhar o link."
      />

      <div>
        <label className="block text-sm font-semibold text-ink">Conteúdo</label>
        <div className="mt-1.5">
          <MarkdownEditor name="content_md" defaultValue={post?.content_md ?? ""} />
        </div>
        <p className="mt-1.5 text-xs text-ink-mute">
          Use # para títulos, **negrito**, *itálico*, - para listas e [texto](link) para links.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Data" name="date" type="date" defaultValue={post?.date} />
        <Field label="Categoria" name="category" defaultValue={post?.category ?? "Notícias"} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Autor" name="author" defaultValue={post?.author ?? ""} />
        <Field label="Imagem de capa (URL)" name="cover" defaultValue={post?.cover ?? ""} />
      </div>

      <Checkbox label="Publicada (visível no site)" name="published" defaultChecked={post?.published ?? false} />
      <SubmitButton />
    </form>
  );
}
