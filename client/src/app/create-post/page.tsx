'use client';

import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import NavBar from '@/components/landingPage/NavBar';
import {
  FiArrowLeft,
  FiSave,
  FiEye,
  FiImage,
  FiBold,
  FiItalic,
  FiLink,
  FiList,
  FiCode,
  FiPlus,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { FaMarkdown, FaHashtag, FaUserAlt } from 'react-icons/fa';
import { MdOutlineTitle, MdOutlineDescription, MdOutlineAnalytics } from 'react-icons/md';
import { HiOutlineSparkles } from 'react-icons/hi';
import Link from 'next/link';
import Image from 'next/image';
import { useCreatePost } from '@/hooks/post/useCreatePost';

// Simple Markdown preview component
const MarkdownPreview = ({ content }: { content: string }) => {
  // Basic markdown rendering (you can replace with a library like react-markdown)
  const renderMarkdown = (text: string) => {
    const html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold">$1</strong>')
      // Italic
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-amber-600 hover:underline" target="_blank">$1</a>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" class="max-w-full rounded-xl my-4 shadow-md" />')
      // Lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      // Code blocks (simple)
      .replace(/```(.*?)```/gim, '<pre class="bg-stone-800 text-stone-100 p-4 rounded-xl overflow-x-auto my-4"><code>$1</code></pre>')
      // Inline code
      .replace(/`(.*?)`/gim, '<code class="bg-stone-100 text-amber-700 px-1.5 py-0.5 rounded-md font-mono text-sm">$1</code>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">');

    return `<p class="mb-4 leading-relaxed">${html}</p>`;
  };

  return (
    <div
      className="prose prose-stone max-w-none text-stone-700"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<{ id: number; text: string; author: string }[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  const { mutateAsync: createPost } = useCreatePost();

  const handleCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        setCoverFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleLike = () => {
    setLikes(prev => prev + 1);
  };

  const handleAddComment = () => {
    if (newComment.trim() && commentAuthor.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          text: newComment.trim(),
          author: commentAuthor.trim(),
        },
      ]);
      setNewComment('');
      setCommentAuthor('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("published", String(true));

      tags.forEach((tag) => {
        formData.append("tags[]", tag);
      });

      if (coverFile) {
        formData.append("coverImage", coverFile);
      }

      await createPost(formData);

      setSubmitStatus("success");

      setTitle("");
      setContent("");
      setTags([]);
      setCoverImage(null);
      setCoverFile(null);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || error.message || "Something went wrong. Please try again.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />
      <main className="pt-28 md:pt-32 pb-20 relative overflow-hidden bg-linear-to-b from-stone-50 to-white min-h-screen">
        {/* decorative abstract circles */}
        <div className="absolute top-40 -left-20 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          {/* Header with back button */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-all group"
            >
              <FiArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to home</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="px-4 py-2 rounded-full border border-stone-300 text-stone-700 hover:border-amber-400 hover:text-amber-600 transition-all flex items-center gap-2 bg-white/50 backdrop-blur-sm"
              >
                <FiEye className="h-4 w-4" />
                {isPreviewMode ? 'Edit mode' : 'Preview mode'}
              </button>
            </div>
          </div>

          {/* Main form */}
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left column - Editor */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cover Image Upload */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/50 shadow-md overflow-hidden">
                  <div className="p-6">
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <FiImage className="h-4 w-4 text-amber-600" />
                      Cover Image
                    </label>
                    <div
                      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-stone-300 border-dashed rounded-xl hover:border-amber-400 transition-all cursor-pointer bg-stone-50/50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="space-y-2 text-center">
                        {coverImage ? (
                          <div className="relative">
                            <Image
                              src={coverImage}
                              alt="Cover preview"
                              width='200'
                              height='200'
                              className="max-h-48 rounded-lg object-cover mx-auto shadow-md"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCoverImage(null);
                                setCoverFile(null);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <FiImage className="mx-auto h-12 w-12 text-stone-400" />
                            <div className="flex text-sm text-stone-600">
                              <span className="relative font-medium text-amber-600 hover:text-amber-500">
                                Upload a cover image
                              </span>
                            </div>
                            <p className="text-xs text-stone-500">PNG, JPG up to 5MB</p>
                          </>
                        )}
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/50 shadow-md overflow-hidden">
                  <div className="p-6">
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <MdOutlineTitle className="h-5 w-5 text-amber-600" />
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your story a compelling title..."
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all text-lg font-semibold bg-white/70"
                      required
                    />
                  </div>
                </div>

                {/* Author Name */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/50 shadow-md overflow-hidden">
                  <div className="p-6">
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <FaUserAlt className="h-4 w-4 text-amber-600" />
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Your name or pen name..."
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all bg-white/70"
                      required
                    />
                  </div>
                </div>

                {/* Markdown Editor */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/50 shadow-md overflow-hidden">
                  <div className="border-b border-stone-100 px-6 py-3 flex flex-wrap gap-3 items-center justify-between bg-stone-50/50">
                    <div className="flex items-center gap-2">
                      <FaMarkdown className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-stone-600">Markdown Editor</span>
                    </div>
                    <div className="flex gap-2 text-stone-500">
                      <button
                        type="button"
                        onClick={() => setContent(content + '**bold text**')}
                        className="p-1.5 hover:bg-stone-200 rounded-md transition"
                        title="Bold"
                      >
                        <FiBold className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setContent(content + '*italic text*')}
                        className="p-1.5 hover:bg-stone-200 rounded-md transition"
                        title="Italic"
                      >
                        <FiItalic className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setContent(content + '[link text](url)')}
                        className="p-1.5 hover:bg-stone-200 rounded-md transition"
                        title="Link"
                      >
                        <FiLink className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setContent(content + '- list item\n')}
                        className="p-1.5 hover:bg-stone-200 rounded-md transition"
                        title="List"
                      >
                        <FiList className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setContent(content + '`inline code`')}
                        className="p-1.5 hover:bg-stone-200 rounded-md transition"
                        title="Code"
                      >
                        <FiCode className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setContent(content + '![alt text](image-url)')}
                        className="p-1.5 hover:bg-stone-200 rounded-md transition"
                        title="Image"
                      >
                        <FiImage className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {!isPreviewMode ? (
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={16}
                      placeholder={`# Your amazing story starts here...

                        You can use **markdown** to format your content:
                        - Lists
                        - **Bold** and *italic* text
                        - [Links](https://example.com)
                        - \`code blocks\`

                        Share your thoughts, stories, and insights with the world.`}
                      className="w-full px-6 py-4 focus:outline-none font-mono text-sm bg-white/70 resize-y"
                      required
                    />
                  ) : (
                    <div className="px-6 py-4 min-h-[400px] bg-white/70 prose max-w-none">
                      {content ? (
                        <MarkdownPreview content={content} />
                      ) : (
                        <p className="text-stone-400 italic">Nothing to preview yet. Start writing above!</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/50 shadow-md overflow-hidden">
                  <div className="p-6">
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <FaHashtag className="h-4 w-4 text-amber-600" />
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-500 transition"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add a tag..."
                        className="flex-1 px-4 py-2 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all bg-white/70"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all flex items-center gap-2"
                      >
                        <FiPlus className="h-4 w-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3.5 bg-stone-900 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <FiSave className="h-5 w-5" />
                        Publish Post
                      </>
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                    <FiCheckCircle className="h-5 w-5" />
                    <span>Post published successfully! Redirecting...</span>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                    <FiAlertCircle className="h-5 w-5" />
                    <span>{errorMessage || "Something went wrong. Please try again."}</span>
                  </div>
                )}
              </div>

              {/* Right column - Preview & Stats */}
              <div className="space-y-6">
                {/* Live Preview Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/50 shadow-md overflow-hidden sticky top-16">
                  <div className="p-5 border-b border-stone-100 bg-linear-to-r from-amber-50/50 to-transparent">
                    <h3 className="font-semibold text-stone-800 flex items-center gap-2">
                      <HiOutlineSparkles className="h-4 w-4 text-amber-500" />
                      Live Preview
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">See how your post will look</p>
                  </div>
                  <div className="p-5">
                    {coverImage && (
                      <Image
                        src={coverImage}
                        alt="Cover"
                        width={40}
                        height={40}
                        className="w-full h-40 object-cover rounded-xl mb-4 shadow-sm"
                      />
                    )}
                    <h2 className="text-xl font-bold text-stone-800 mb-2">
                      {title || 'Your title will appear here'}
                    </h2>
                    {authorName && (
                      <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
                        <FaUserAlt className="h-3 w-3" />
                        <span>{authorName}</span>
                      </div>
                    )}
                    <div className="text-sm text-stone-600 line-clamp-4">
                      {content ? (
                        <MarkdownPreview content={content.slice(0, 200) + (content.length > 200 ? '...' : '')} />
                      ) : (
                        <p className="text-stone-400 italic">Your story will be displayed here...</p>
                      )}
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-stone-100">
                        {tags.map((tag) => (
                          <span key={tag} className="text-xs text-amber-600">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Simulation Card
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/50 shadow-md overflow-hidden">
                  <div className="p-5">
                    <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                      <MdOutlineAnalytics className="h-4 w-4 text-amber-500" />
                      Post Stats (Demo)
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-600">❤️ Likes</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-700">{likes}</span>
                          <button
                            type="button"
                            onClick={handleLike}
                            className="px-3 py-1 text-sm bg-amber-50 text-amber-600 rounded-full hover:bg-amber-100 transition"
                          >
                            Like
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-600">💬 Comments</span>
                        <span className="font-bold text-amber-700">{comments.length}</span>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Comments Demo Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/50 shadow-md overflow-hidden">
                  <div className="p-5">
                    <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                      <MdOutlineDescription className="h-4 w-4 text-amber-500" />
                      Comments Preview
                    </h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {comments.length === 0 ? (
                        <p className="text-stone-400 text-sm italic">No comments yet. Be the first!</p>
                      ) : (
                        comments.map((comment) => (
                          <div key={comment.id} className="border-b border-stone-100 pb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-stone-800 text-sm">{comment.author}</span>
                            </div>
                            <p className="text-stone-600 text-sm">{comment.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-100">
                      <input
                        type="text"
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 mb-2 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="flex-1 px-3 py-2 text-sm rounded-lg border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button
                          type="button"
                          onClick={handleAddComment}
                          className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition text-sm"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}