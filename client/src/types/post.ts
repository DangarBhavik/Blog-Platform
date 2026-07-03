// types/post.ts

export interface CreatePostPayload {
  title: string;
  content: string;
  tags: string[];
  coverImage?: string;
  coverImageFile?: File;
  published?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
  createdAt: string;
}