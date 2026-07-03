'use client';

import NavBar from '@/components/landingPage/NavBar';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  FiCalendar,
  FiEye,
  FiHeart,
  FiMessageCircle,
  FiPlus,
  FiTrash2,
  FiBookOpen,
  FiFileText,
  FiBarChart2,
  FiAlertTriangle,
  FiX,
  FiCheckCircle,
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { useMyPosts } from '@/hooks/post/useMyPosts';
import { useDeletePost } from '@/hooks/post/useDeletePost';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';

const formatDate = (dateString?: string) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function MyPostsPage() {
  const { data: currentUser } = useCurrentUser();
  const { data: posts, isLoading, error } = useMyPosts();
  const deletePostMutation = useDeletePost();

  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDeleteConfirm = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete, {
        onSuccess: () => {
          setDeleteStatus('success');
          setPostToDelete(null);
          setTimeout(() => setDeleteStatus('idle'), 3000);
        },
        onError: () => {
          setDeleteStatus('error');
          setPostToDelete(null);
          setTimeout(() => setDeleteStatus('idle'), 3000);
        }
      });
    }
  };

  // Stats calculation
  const totalPosts = posts?.length || 0;
  const publishedCount = posts?.filter((p: any) => p.published).length || 0;
  const draftCount = posts?.filter((p: any) => !p.published).length || 0;
  const totalLikes = posts?.reduce((acc: number, cur: any) => acc + (cur.likes || 0), 0) || 0;

  return (
    <>
      <NavBar />
      <main className="pt-28 md:pt-32 pb-20 relative overflow-hidden bg-linear-to-b from-stone-50 to-white min-h-screen">
        {/* Decorative Elements */}
        <div className="absolute top-40 -left-20 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 border-b border-stone-200 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight mb-2">
                My Blogs
              </h1>
              <p className="text-stone-500 text-sm">
                Manage, analyze, and publish your personal writing dashboard.
              </p>
            </div>
            <Link
              href="/create-post"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition shadow-md"
            >
              <FiPlus className="h-4 w-4" />
              Write a Post
            </Link>
          </div>

          {/* Toast Messages */}
          {deleteStatus === 'success' && (
            <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 animate-fadeIn">
              <FiCheckCircle className="h-5 w-5" />
              <span className="text-sm font-semibold">Post deleted successfully.</span>
            </div>
          )}
          {deleteStatus === 'error' && (
            <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 animate-fadeIn">
              <FiAlertTriangle className="h-5 w-5" />
              <span className="text-sm font-semibold">Failed to delete post. Please try again.</span>
            </div>
          )}

          {/* Stats Cards Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            {[
              {
                title: "Total Posts",
                value: isLoading ? "-" : totalPosts,
                icon: <FiBookOpen className="h-5 w-5 text-amber-600" />,
                bg: "from-amber-500/10 to-amber-600/5",
              },
              {
                title: "Published",
                value: isLoading ? "-" : publishedCount,
                icon: <FiCheckCircle className="h-5 w-5 text-green-600" />,
                bg: "from-green-500/10 to-green-600/5",
              },
              {
                title: "Drafts",
                value: isLoading ? "-" : draftCount,
                icon: <FiFileText className="h-5 w-5 text-stone-500" />,
                bg: "from-stone-500/10 to-stone-600/5",
              },
              {
                title: "Total Likes",
                value: isLoading ? "-" : totalLikes,
                icon: <FiHeart className="h-5 w-5 text-red-500" />,
                bg: "from-red-500/10 to-red-600/5",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`bg-linear-to-br ${stat.bg} p-6 rounded-2xl border border-stone-200/50 shadow-sm flex items-center justify-between`}
              >
                <div>
                  <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider block mb-1">
                    {stat.title}
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold text-stone-800">
                    {stat.value}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-inner">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Error View */}
          {error && (
            <div className="my-10 p-8 bg-red-50 border border-red-200 rounded-3xl text-center space-y-4 max-w-md mx-auto shadow-sm">
              <FiAlertTriangle className="h-10 w-10 text-red-500 mx-auto" />
              <h3 className="font-bold text-stone-800 text-lg">Failed to load posts</h3>
              <p className="text-stone-600 text-sm">
                We encountered an error loading your posts. Please check your credentials or reload.
              </p>
            </div>
          )}

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden animate-pulse">
              <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50 h-14" />
              <div className="divide-y divide-stone-100">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 bg-stone-200 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-stone-200 rounded w-1/3" />
                      <div className="h-3 bg-stone-200 rounded w-1/4" />
                    </div>
                    <div className="w-20 h-6 bg-stone-200 rounded" />
                    <div className="w-16 h-8 bg-stone-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && totalPosts === 0 && (
            <div className="text-center py-20 bg-white border border-stone-200 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
              <HiOutlineSparkles className="h-12 w-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-stone-800 mb-2">No blogs found</h3>
              <p className="text-stone-600 mb-6 max-w-md mx-auto text-sm">
                You haven't written any blog posts yet. Share your stories, tutorials, or updates with our readers!
              </p>
              <Link
                href="/create-post"
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-amber-700 transition shadow-md text-sm"
              >
                <FiPlus className="h-4 w-4" />
                Write Your First Post
              </Link>
            </div>
          )}

          {/* Posts Dashboard List */}
          {!isLoading && !error && posts && posts.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/50 text-stone-500 font-semibold text-xs uppercase tracking-wider">
                      <th className="py-4 px-6">Post Details</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-center">Stats</th>
                      <th className="py-4 px-6 text-center">Date Created</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm">
                    {posts.map((post: any) => {
                      const coverImg = post.coverImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop";
                      return (
                        <tr key={post.id} className="hover:bg-stone-50/40 transition-colors">
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-4">
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                                <Image
                                  src={coverImg}
                                  alt={post.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 max-w-xs md:max-w-sm lg:max-w-md">
                                <h3 className="font-bold text-stone-800 truncate mb-1 text-sm md:text-base leading-snug">
                                  {post.title}
                                </h3>
                                <p className="text-stone-500 text-xs truncate max-w-sm leading-relaxed">
                                  {post.excerpt || (post.content ? post.content.substring(0, 100) + "..." : "")}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-6 text-center">
                            {post.published ? (
                              <span className="inline-flex px-2.5 py-1 text-xs bg-green-50 text-green-700 rounded-full font-semibold border border-green-200">
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex px-2.5 py-1 text-xs bg-stone-100 text-stone-600 rounded-full font-semibold border border-stone-200">
                                Draft
                              </span>
                            )}
                          </td>
                          <td className="py-5 px-6 text-center">
                            <div className="flex items-center justify-center gap-4 text-xs text-stone-500 font-medium">
                              <span className="flex items-center gap-1">
                                <FiHeart className="h-3.5 w-3.5 text-red-400" />
                                {post.likes || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiMessageCircle className="h-3.5 w-3.5 text-amber-500" />
                                {post.comments?.length || 0}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 px-6 text-center text-stone-500 font-medium text-xs">
                            <div className="flex items-center justify-center gap-1">
                              <FiCalendar className="h-3.5 w-3.5" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </td>
                          <td className="py-5 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/posts/${post.id}`}
                                className="p-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-amber-100 hover:text-amber-700 transition"
                                title="View Post"
                              >
                                <FiEye className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => setPostToDelete(post.id)}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                title="Delete Post"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {postToDelete && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-scaleIn">
                <button
                  onClick={() => setPostToDelete(null)}
                  className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                >
                  <FiX className="h-5 w-5" />
                </button>
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                    <FiTrash2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-800">Delete Post?</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Are you sure you want to delete this blog post? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setPostToDelete(null)}
                      className="flex-1 px-4 py-2 border border-stone-300 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      disabled={deletePostMutation.isPending}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {deletePostMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
