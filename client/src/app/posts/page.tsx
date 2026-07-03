'use client';

import NavBar from '@/components/landingPage/NavBar';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiCalendar,
  FiUser,
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiShare2,
  FiArrowRight,
  FiAlertTriangle,
  FiPlus,
} from 'react-icons/fi';
import { FaHashtag } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';
import { usePosts } from '@/hooks/post/usePosts';

// Dynamic Date Formatter
const formatDate = (dateString?: string) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Dynamic Read Time Calculator
const getReadTime = (content?: string) => {
  if (!content) return "1 min read";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // 200 WPM
  return `${minutes} min read`;
};

// Skeleton Card component for premium loading experience
const PostCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden animate-pulse">
    <div className="w-full h-56 bg-stone-200" />
    <div className="p-6 space-y-4">
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-stone-100 rounded-full" />
        <div className="h-5 w-16 bg-stone-100 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-stone-200 rounded-md" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-stone-200 rounded-md" />
        <div className="h-4 w-5/6 bg-stone-200 rounded-md" />
      </div>
      <div className="h-4 w-1/2 bg-stone-100 rounded-md" />
    </div>
  </div>
);

// Post Card Component
const PostCard = ({ post }: { post: any }) => {
  const coverImage = post.coverImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop";

  return (
    <article className="group bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Cover Image */}
      <Link href={`/posts/${post.id}`} className="block overflow-hidden relative w-full h-56 bg-stone-100 flex-shrink-0">
        <Image
          src={coverImage}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="p-6 flex flex-col flex-1">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags && post.tags.length > 0 ? (
            post.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs bg-amber-50/70 text-amber-700 px-2.5 py-1 rounded-full font-medium"
              >
                <FaHashtag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))
          ) : (
            <span className="inline-flex items-center gap-1 text-xs bg-stone-50 text-stone-500 px-2.5 py-1 rounded-full font-medium">
              General
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/posts/${post.id}`}>
          <h2 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-stone-600 mb-4 leading-relaxed line-clamp-3 flex-1 text-sm">
          {post.excerpt || (post.content ? post.content.substring(0, 150) + "..." : "")}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mb-4 pt-3 border-t border-stone-50 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-5.5 h-5.5 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
              {post.author?.image ? (
                <Image src={post.author.image} alt={post.author.name} width={22} height={22} className="object-cover" />
              ) : (
                <FiUser className="h-3 w-3 text-amber-600" />
              )}
            </div>
            <span className="font-medium text-stone-700">{post.author?.name || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="h-3 w-3" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiMessageCircle className="h-3 w-3" />
            <span>{getReadTime(post.content)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-stone-500">
              <FiHeart className="h-4 w-4 text-red-400" />
              <span className="text-sm">{post.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500">
              <FiMessageCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm">{post.comments?.length || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
              <FiBookmark className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
              <FiShare2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default function PostsPage() {
  const { data: posts, isLoading, error } = usePosts();

  return (
    <>
      <NavBar />
      <main className="pt-28 md:pt-32 pb-20 relative overflow-hidden bg-linear-to-b from-stone-50 to-white min-h-screen">
        {/* Decorative Elements */}
        <div className="absolute top-40 -left-20 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm mb-4">
              <HiOutlineSparkles className="h-4 w-4" />
              <span>Discover Stories</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
              All Posts
            </h1>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Explore stories, insights, and experiences shared by our community.
              From tech tutorials to personal journeys, find what inspires you.
            </p>
          </div>

          {/* Create Post CTA for Mobile */}
          <div className="lg:hidden mb-8">
            <Link
              href="/create-post"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all duration-300 shadow-lg"
            >
              <FiPlus className="h-4 w-4" />
              Write a Post
            </Link>
          </div>

          {/* Error State */}
          {error && (
            <div className="max-w-md mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-2xl text-center space-y-4 shadow-sm">
              <FiAlertTriangle className="h-10 w-10 text-red-500 mx-auto" />
              <h3 className="font-bold text-stone-800 text-lg">Failed to load posts</h3>
              <p className="text-stone-600 text-sm">
                There was a problem communicating with the server. Please check your connection or reload.
              </p>
            </div>
          )}

          {/* Loading State Skeletons */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, idx) => (
                <PostCardSkeleton key={idx} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && (!posts || posts.length === 0) && (
            <div className="text-center py-20 bg-white border border-stone-200 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
              <HiOutlineSparkles className="h-12 w-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-stone-800 mb-2">No posts available</h3>
              <p className="text-stone-600 mb-6 max-w-md mx-auto">
                Be the first contributor to share stories, insights, or tech guidelines on our platform.
              </p>
              <Link
                href="/create-post"
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all shadow-md"
              >
                <FiPlus className="h-4 w-4" />
                Write a Post
              </Link>
            </div>
          )}

          {/* Dynamic Posts Grid */}
          {!isLoading && !error && posts && posts.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {posts.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Post Count */}
              <div className="text-center mt-12 text-sm text-stone-500 font-medium bg-stone-100/50 inline-block px-4 py-1.5 rounded-full mx-auto left-1/2 -translate-x-1/2 relative">
                Showing {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </div>
            </>
          )}

          {/* Floating Create Button for Desktop */}
          <div className="hidden lg:block fixed bottom-8 right-8 z-20">
            <Link
              href="/create-post"
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-full font-semibold hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <FiPlus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
              Write a Post
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}