import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { blogPosts } from "@/lib/data/blog";

export default function BlogPage() {
  return (
    <PageShell>
      <PageHeader title="Blog" />

      <Container className="py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <Badge tone="sky" className="w-fit">
                  {post.category}
                </Badge>
                <h3 className="text-lg font-bold text-navy-900">{post.title}</h3>
                <p className="flex-1 text-sm text-slate-600">{post.excerpt}</p>
                <p className="text-xs text-slate-400">
                  {post.author} · {post.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </PageShell>
  );
}
