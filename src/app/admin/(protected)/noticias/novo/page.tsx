import { PostForm } from "../PostForm";
import { createPost } from "../actions";

export const metadata = { title: "Nova notícia" };

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Nova notícia</h1>
      <PostForm action={createPost} />
    </div>
  );
}
