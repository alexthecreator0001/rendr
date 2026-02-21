import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ConvertClient } from "./convert-client";

export const metadata = { title: "Convert — Rendr" };

export default async function ConvertPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Convert</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste a URL or drop in raw HTML and download your PDF in seconds.
        </p>
      </div>
      <ConvertClient />
    </div>
  );
}
