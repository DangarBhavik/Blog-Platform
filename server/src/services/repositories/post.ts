import { prisma } from "../../prisma/client";

export type CreatePostDto = {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
  published?: boolean;
  authorId?: string;
  slug: string;
};

export const createPost = async (postData: CreatePostDto) => {
  const existingPost = await prisma.post.findUnique({
    where: {
      slug: postData.slug,
    },
  });

  const slug = existingPost
    ? `${postData.slug}-${Date.now()}`
    : postData.slug;

  const data: any = {
    title: postData.title,
    content: postData.content,
    excerpt: postData.excerpt,
    coverImage: postData.coverImage,
    tags: postData.tags,
    slug,
    published: postData.published ?? false,
    publishedAt: postData.published ? new Date() : null,
  };

  if (postData.authorId) {
    data.authorId = postData.authorId;
  }

  return prisma.post.create({
    data,
  });
};

export const getPosts = async () => {
  return prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      comments: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getPostById = async (id: string) => {
  return prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      likes_on: {
        select: {
          userId: true,
        },
      },
    },
  });
};

export const createComment = async (postId: string, authorId: string, content: string) => {
  return prisma.comment.create({
    data: {
      postId,
      authorId,
      content,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
};

export const toggleLike = async (postId: string, userId: string) => {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (existingLike) {
    return prisma.$transaction([
      prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          likes: {
            decrement: 1,
          },
        },
      }),
    ]);
  } else {
    return prisma.$transaction([
      prisma.like.create({
        data: {
          postId,
          userId,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          likes: {
            increment: 1,
          },
        },
      }),
    ]);
  }
};

export const getPostsByAuthor = async (authorId: string) => {
  return prisma.post.findMany({
    where: {
      authorId,
    },
    include: {
      comments: {
        select: {
          id: true,
        },
      },
      likes_on: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deletePostById = async (id: string, authorId: string) => {
  return prisma.post.delete({
    where: {
      id,
      authorId,
    },
  });
};


