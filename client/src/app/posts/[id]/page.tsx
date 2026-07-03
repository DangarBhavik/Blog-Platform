'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/landingPage/NavBar';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  FiArrowLeft,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiBookmark,
  FiCalendar,
  FiClock,
  FiTag,
  FiTwitter,
  FiLinkedin,
  FiLink,
  FiCheck,
  FiUser,
  FiAlertTriangle,
} from 'react-icons/fi';
import { FaHashtag } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';
import { usePostDetail } from '@/hooks/post/usePostDetail';
import { useAddComment } from '@/hooks/post/useAddComment';
import { useToggleLike } from '@/hooks/post/useToggleLike';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';

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
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};

// Comment Component
const CommentItem = ({ comment }: { comment: any }) => {
  return (
    <div className="flex gap-4 py-4 border-b border-stone-100 last:border-0">
      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0">
        {comment.author?.image ? (
          <Image
            src={comment.author.image}
            alt={comment.author.name}
            width={40}
            height={40}
            className="object-cover h-10 w-10"
          />
        ) : (
          <FiUser className="h-5 w-5 text-amber-600" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-stone-800 text-sm">{comment.author?.name || "Anonymous"}</span>
          <span className="text-xs text-stone-400">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-stone-600 text-sm leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
};

// Markdown Renderer Component
const MarkdownRenderer = ({ content }: { content: string }) => {
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    let html = '';
    let inList = false;
    let listType = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('# ')) {
        html += `<h1 class="text-3xl md:text-4xl font-bold text-stone-800 mt-8 mb-4">${line.slice(2)}</h1>`;
      }
      else if (line.startsWith('## ')) {
        html += `<h2 class="text-2xl md:text-3xl font-bold text-stone-800 mt-8 mb-4">${line.slice(3)}</h2>`;
      }
      else if (line.startsWith('### ')) {
        html += `<h3 class="text-xl md:text-2xl font-bold text-stone-800 mt-6 mb-3">${line.slice(4)}</h3>`;
      }
      else if (line.startsWith('> ')) {
        html += `<blockquote class="border-l-4 border-amber-400 pl-4 my-4 italic text-stone-600">${line.slice(2)}</blockquote>`;
      }
      else if (line.match(/^-\s/)) {
        if (!inList || listType !== 'ul') {
          if (inList) html += `</ul>`;
          html += `<ul class="list-disc ml-6 my-3 space-y-2">`;
          inList = true;
          listType = 'ul';
        }
        html += `<li class="text-stone-600 text-sm leading-relaxed">${line.slice(2)}</li>`;
      }
      else if (line.match(/^\d+\.\s/)) {
        if (!inList || listType !== 'ol') {
          if (inList) html += `</ol>`;
          html += `<ol class="list-decimal ml-6 my-3 space-y-2">`;
          inList = true;
          listType = 'ol';
        }
        html += `<li class="text-stone-600 text-sm leading-relaxed">${line.replace(/^\d+\.\s/, '')}</li>`;
      }
      else {
        if (inList) {
          html += `</${listType === 'ul' ? 'ul' : 'ol'}>`;
          inList = false;
          listType = '';
        }
        if (line.trim() === '') {
          continue;
        }
        const processedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-stone-800">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-amber-600 hover:underline" target="_blank">$1</a>')
          .replace(/`(.*?)`/g, '<code class="bg-stone-100 text-amber-700 px-1.5 py-0.5 rounded-md font-mono text-xs">$1</code>');
        
        html += `<p class="text-stone-600 leading-relaxed mb-4 text-sm md:text-base">${processedLine}</p>`;
      }
    }
    
    if (inList) {
      html += `</${listType === 'ul' ? 'ul' : 'ol'}>`;
    }
    
    return html;
  };

  return (
    <div 
      className="prose prose-stone max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, error } = usePostDetail(id);

  const addCommentMutation = useAddComment(id);
  const toggleLikeMutation = useToggleLike(id);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newComment, setNewComment] = useState('');

  const post = data?.post;
  const relatedPosts = data?.relatedPosts;

  // Sync likes and liked status
  useEffect(() => {
    if (post) {
      setLikesCount(post.likes);
      if (currentUser && post.likes_on) {
        const userHasLiked = post.likes_on.some((l: any) => l.userId === currentUser.id);
        setLiked(userHasLiked);
      }
    }
  }, [post, currentUser]);

  const handleLike = () => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    // Optimistic Update
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);

    toggleLikeMutation.mutate(undefined, {
      onError: () => {
        // Rollback
        setLiked(liked);
        setLikesCount(prev => liked ? prev + 1 : prev - 1);
      }
    });
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: `Check out this post: ${post?.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment.trim(), {
        onSuccess: () => {
          setNewComment('');
        }
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <NavBar />
        <main className="pt-28 md:pt-32 pb-20 bg-stone-50 min-h-screen animate-pulse">
          <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-6">
            <div className="h-6 w-32 bg-stone-200 rounded" />
            <div className="space-y-4">
              <div className="h-10 w-3/4 bg-stone-200 rounded" />
              <div className="h-6 w-1/2 bg-stone-200 rounded" />
            </div>
            <div className="h-[400px] w-full bg-stone-200 rounded-2xl" />
          </div>
        </main>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <NavBar />
        <main className="pt-28 md:pt-32 pb-20 bg-stone-50 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 p-8 bg-white border border-stone-200 rounded-3xl max-w-md shadow-sm">
            <FiAlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-2xl font-bold text-stone-800">Post not found</h3>
            <p className="text-stone-600">The story you are looking for does not exist or has been deleted.</p>
            <Link
              href="/posts"
              className="inline-flex px-6 py-2.5 bg-stone-900 text-white rounded-xl hover:bg-amber-700 transition"
            >
              Back to all posts
            </Link>
          </div>
        </main>
      </>
    );
  }

  const coverImage = post.coverImage || "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=600&fit=crop";
  const authorAvatar = post.author?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || "Author")}&background=random&color=fff`;

  return (
    <>
      <NavBar />
      <main className="pt-28 md:pt-32 pb-20 relative overflow-hidden bg-linear-to-b from-stone-50 to-white min-h-screen">
        {/* Decorative Elements */}
        <div className="absolute top-40 -left-20 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          {/* Back Button */}
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-all group mb-8"
          >
            <FiArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to all posts</span>
          </Link>

          {/* Header Section */}
          <div className="mb-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags && post.tags.length > 0 ? (
                post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium"
                  >
                    <FaHashtag className="h-3 w-3" />
                    {tag}
                  </span>
                ))
              ) : (
                <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">
                  General
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-stone-800 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author & Meta Info */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-stone-100">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center border border-amber-200">
                  <Image
                    src={authorAvatar}
                    alt={post.author?.name || "Author"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-stone-800 text-sm md:text-base">{post.author?.name || "Anonymous"}</div>
                  <div className="text-xs text-stone-500">Joined {formatDate(post.author?.createdAt)}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-stone-500">
                <div className="flex items-center gap-1.5">
                  <FiCalendar className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiClock className="h-4 w-4" />
                  <span>{getReadTime(post.content)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden mb-10 shadow-xl bg-stone-100">
            <Image
              src={coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content Section */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-sm">
                <MarkdownRenderer content={post.content} />
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2 border-b border-stone-100 pb-4">
                  <FiMessageCircle className="h-5 w-5 text-amber-500" />
                  Comments ({post.comments?.length || 0})
                </h3>

                {/* Add Comment Form */}
                {currentUser ? (
                  <div className="mb-8 space-y-3 bg-stone-50/50 p-4 rounded-xl border border-stone-100">
                    <div className="text-xs text-stone-500 font-medium">
                      Commenting as <span className="text-amber-700 font-semibold">{currentUser.name}</span>
                    </div>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts on this story..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none text-sm"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={addCommentMutation.isPending || !newComment.trim()}
                      className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                ) : (
                  <div className="mb-8 p-6 border border-dashed border-stone-200 rounded-xl text-center bg-stone-50">
                    <p className="text-stone-600 text-sm mb-3 font-medium">You must be logged in to participate in the conversation.</p>
                    <Link
                      href="/auth/login"
                      className="inline-flex px-5 py-2 bg-stone-900 text-white text-sm rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                    >
                      Log In
                    </Link>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-1">
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment: any) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))
                  ) : (
                    <p className="text-stone-400 text-sm italic py-4">No comments yet. Share your thoughts above!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Action Buttons */}
                <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
                  <div className="flex justify-around">
                    <button
                      onClick={handleLike}
                      className={`flex flex-col items-center gap-1 transition-colors ${
                        liked ? 'text-red-500 animate-pulse' : 'text-stone-500 hover:text-red-500'
                      }`}
                    >
                      <FiHeart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
                      <span className="text-xs font-semibold">{likesCount}</span>
                    </button>
                    <button
                      onClick={handleBookmark}
                      className={`flex flex-col items-center gap-1 transition-colors ${
                        bookmarked ? 'text-amber-600' : 'text-stone-500 hover:text-amber-600'
                      }`}
                    >
                      <FiBookmark className={`h-6 w-6 ${bookmarked ? 'fill-current' : ''}`} />
                      <span className="text-xs font-semibold">Save</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex flex-col items-center gap-1 text-stone-500 hover:text-amber-600 transition-colors relative"
                    >
                      {copied ? (
                        <>
                          <FiCheck className="h-6 w-6 text-green-500" />
                          <span className="text-xs font-semibold text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <FiShare2 className="h-6 w-6" />
                          <span className="text-xs font-semibold">Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Share Options */}
                <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
                  <h4 className="font-semibold text-stone-700 text-xs uppercase tracking-wider">Share this post</h4>
                  <div className="flex gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this post: ${post.title}`)}&url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1DA1F2] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition"
                    >
                      <FiTwitter className="h-3.5 w-3.5" />
                      Tweet
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0A66C2] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition"
                    >
                      <FiLinkedin className="h-3.5 w-3.5" />
                      Share
                    </a>
                  </div>
                </div>

                {/* Related Posts */}
                {relatedPosts && relatedPosts.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-4">
                    <h4 className="font-semibold text-stone-700 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-stone-100 pb-2">
                      <HiOutlineSparkles className="h-4 w-4 text-amber-500" />
                      Related Stories
                    </h4>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost: any) => {
                        const relCover = relatedPost.coverImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop";
                        return (
                          <Link
                            key={relatedPost.id}
                            href={`/posts/${relatedPost.id}`}
                            className="block group"
                          >
                            <div className="flex gap-3">
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                                <Image
                                  src={relCover}
                                  alt={relatedPost.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-stone-800 group-hover:text-amber-600 transition-colors text-xs line-clamp-2 leading-snug">
                                  {relatedPost.title}
                                </h5>
                                <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1.5 font-medium">
                                  <FiClock className="h-3 w-3" />
                                  <span>{getReadTime(relatedPost.content)}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tags Cloud */}
                {post.tags && post.tags.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
                    <h4 className="font-semibold text-stone-700 text-xs uppercase tracking-wider flex items-center gap-2">
                      <FiTag className="h-4 w-4 text-amber-500" />
                      Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
