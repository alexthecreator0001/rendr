"use client";

import { useActionState, useState } from "react";
import {
  createBlogPostAction,
  updateBlogPostAction,
  deleteBlogPostAction,
  toggleBlogPublishedAction,
} from "@/app/admin/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Plus, Pencil, Trash2, FileText, Eye, EyeOff, AlertTriangle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const TAGS = ["Engineering", "Guide", "Case study", "Deep dive", "Product", "News"];

function PostForm({
  defaultValues,
  hiddenId,
  action,
  pending,
  state,
  onClose,
  submitLabel,
}: {
  defaultValues?: Partial<Post>;
  hiddenId?: string;
  action: (payload: FormData) => void;
  pending: boolean;
  state: { error?: string } | null;
  onClose: () => void;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-4 pt-1">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />{state.error}
        </div>
      )}
      {hiddenId && <input type="hidden" name="id" value={hiddenId} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title</Label>
          <Input name="title" defaultValue={defaultValues?.title} placeholder="How to create PDF templates with AI" required className="rounded-xl" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tag</Label>
          <select
            name="tag"
            defaultValue={defaultValues?.tag ?? "Engineering"}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</Label>
          <select
            name="published"
            defaultValue={defaultValues?.published ? "true" : "false"}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="false">Draft</option>
            <option value="true">Published</option>
          </select>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Excerpt</Label>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={defaultValues?.excerpt}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder="Short description shown on the blog listing page…"
            required
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Content <span className="normal-case text-muted-foreground/60 ml-1">(Markdown supported)</span>
          </Label>
          <textarea
            name="content"
            rows={16}
            defaultValue={defaultValues?.content}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-mono text-xs leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder={"## Introduction\n\nWrite your blog post content here…\n\n## Section heading\n\nMore content…"}
            required
          />
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
        <Button type="submit" disabled={pending} className="rounded-lg">
          {pending ? "Saving…" : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}

function CreateDialog() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createBlogPostAction, null);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 rounded-lg">
          <Plus className="h-4 w-4" /> New post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>New blog post</DialogTitle>
          <DialogDescription>The slug is auto-generated from the title.</DialogDescription>
        </DialogHeader>
        <PostForm
          action={action}
          pending={pending}
          state={state}
          onClose={() => setOpen(false)}
          submitLabel="Create post"
        />
      </DialogContent>
    </Dialog>
  );
}

function EditDialog({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(updateBlogPostAction, null);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          title="Edit"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
          <DialogDescription>Slug: <code className="font-mono text-xs bg-muted px-1 rounded">/blog/{post.slug}</code></DialogDescription>
        </DialogHeader>
        <PostForm
          defaultValues={post}
          hiddenId={post.id}
          action={action}
          pending={pending}
          state={state}
          onClose={() => setOpen(false)}
          submitLabel="Save changes"
        />
      </DialogContent>
    </Dialog>
  );
}

function TogglePublishButton({ post }: { post: Post }) {
  const [, action, pending] = useActionState(toggleBlogPublishedAction, null);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={post.id} />
      <button
        type="submit"
        disabled={pending}
        title={post.published ? "Unpublish" : "Publish"}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg border transition-colors",
          post.published
            ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
            : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        {post.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
      </button>
    </form>
  );
}

function DeleteButton({ id }: { id: string }) {
  const [, action, pending] = useActionState(deleteBlogPostAction, null);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        title="Delete"
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}

export function AdminBlogClient({ posts }: { posts: Post[] }) {
  const published = posts.filter((p) => p.published).length;
  const drafts = posts.length - published;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
            {published > 0 && ` · ${published} published`}
            {drafts > 0 && ` · ${drafts} draft${drafts !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View blog
          </Link>
          <CreateDialog />
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/50">
            <FileText className="h-8 w-8 text-muted-foreground/25" />
          </div>
          <p className="font-semibold text-sm">No posts yet</p>
          <p className="mt-1.5 max-w-[260px] text-xs text-muted-foreground">
            Create your first blog post to share with the world.
          </p>
          <div className="mt-6"><CreateDialog /></div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Tag</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className={cn("transition-colors hover:bg-muted/20", !post.published && "opacity-60")}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm truncate max-w-xs">{post.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{post.tag}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-xs font-medium",
                      post.published ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                    )}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="View post"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      <TogglePublishButton post={post} />
                      <EditDialog post={post} />
                      <DeleteButton id={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
