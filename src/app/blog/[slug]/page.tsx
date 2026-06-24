import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { blogPosts, findBlogPost } from "@/lib/data/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = findBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <PageShell>
      <div className="relative h-72 w-full sm:h-96">
        <Image src={post.image} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
        <Container className="absolute inset-x-0 bottom-0 pb-10 text-white">
          <Badge tone="amber" className="mb-3">
            {post.category}
          </Badge>
          <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl">{post.title}</h1>
          <p className="mt-2 text-sm text-slate-200">
            {post.author} · {post.date}
          </p>
        </Container>
      </div>

      <Container className="max-w-3xl py-12">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:underline"
        >
          <ArrowLeft size={16} /> Back to blog
        </Link>
        <div className="flex flex-col gap-5 text-slate-700">
          {post.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </PageShell>
  );
}
