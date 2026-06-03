import { blogPosts, recentPosts } from "@/lib/mock-data";
import { BlogClient } from "@/components/blog-client";

export default function BlogPage() {
  return <BlogClient initialPosts={blogPosts} recentPosts={recentPosts} />;
}