import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { PostForm } from "../PostForm";
import { updatePost } from "../actions";

export const metadata = { title: "Editar notícia" };

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getSupabaseAdmin();
  const { data: post } = db
    ? await db.from("posts").select("*").eq("slug", slug).maybeSingle()
    : { data: null };

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Editar notícia</h1>
      <PostForm post={post} action={updatePost.bind(null, slug)} />
    </div>
  );
}
