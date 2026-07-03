import { prisma } from "../src/prisma/client";
import bcrypt from "bcryptjs";

const postsData = [
  {
    title: "The Art of Minimalist Living: Finding Joy in Less",
    excerpt: "In a world that constantly tells us to want more, discover how embracing minimalism can lead to greater happiness, clarity, and purpose...",
    content: `In a world that constantly tells us to want more, discover how embracing minimalism can lead to greater happiness, clarity, and purpose.

## The Philosophy Behind Minimalism

Minimalism isn't about having nothing. It's about making room for what truly matters. When we strip away the excess, we create space for experiences, relationships, and personal growth that truly enrich our lives.

Many people mistakenly believe that minimalism means living in an empty white room with only a chair and a table. But that's not the essence of minimalism. True minimalism is intentionality. It's about choosing to keep things that add value to your life and letting go of everything else.

### The Mental Benefits

Research has shown that cluttered spaces can lead to increased cortisol levels and decreased focus. When we clear our physical environment, we often find that our mental environment becomes clearer too.

Here are some key benefits of adopting a minimalist mindset:

- **Reduced anxiety** - Less stuff means less to worry about
- **More focus** - Fewer distractions allow for deeper work
- **Financial freedom** - Spending less on things means saving more for experiences
- **Environmental impact** - Consuming less reduces your carbon footprint
- **Better relationships** - More time and energy for people who matter

## Practical Steps to Start

Starting your minimalist journey doesn't require throwing away everything you own overnight. In fact, that approach often leads to regret and burnout.

### The 30-Day Minimalism Challenge

Day 1-10: Start with obvious clutter (expired items, broken things, duplicates)
Day 11-20: Move to sentimental items (keep what truly sparks joy)
Day 21-30: Address digital clutter (emails, apps, files, subscriptions)

### One In, One Out Rule

For every new item you bring into your home, commit to removing one item. This simple rule prevents accumulation while allowing for necessary purchases.

## Real Stories, Real Impact

> "Minimalism changed my life. I went from drowning in debt and anxiety to owning my time and my peace. It's not about the stuff I gave up, but about the life I gained."
> — Sarah, minimalist of 5 years

## The Journey Continues

Remember that minimalism looks different for everyone. A family of five will have different needs than a single professional living in a studio apartment. The goal isn't to compete with anyone else's version of minimalism, but to find what works for you.

Start small. Be patient with yourself. And most importantly, enjoy the freedom that comes with letting go.`,
    coverImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop",
    tags: ["lifestyle", "minimalism", "mindfulness"],
    slug: "the-art-of-minimalist-living-finding-joy-in-less",
  },
  {
    title: "Mastering React 19: A Comprehensive Guide to Modern Development",
    excerpt: "Explore the latest features in React 19 including Server Components, Actions, and the new compiler that's changing how we build web apps...",
    content: `Explore the latest features in React 19 including Server Components, Actions, and the new compiler that's changing how we build web apps.

## What is new in React 19?

React 19 brings exciting improvements to state management, asynchronous actions, and rendering performance. The React Compiler (React Forget) is now open source and handles memoization automatically, reducing the need for \`useMemo\` and \`useCallback\`.

### Actions API

React 19 introduces support for using async functions in transitions to handle pending states, errors, form submissions, and optimistic updates automatically.

For example, you can now use:
\`\`\`javascript
const [name, setName] = useState("");
const [isPending, startTransition] = useTransition();

const handleSubmit = () => {
  startTransition(async () => {
    await updateName(name);
  });
};
\`\`\`

### Server Components

React Server Components are now a first-class citizen in React 19, allowing components to run on the server before client-side rendering. This significantly improves bundle sizes and initial page loading times.`,
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    tags: ["react", "javascript", "webdev"],
    slug: "mastering-react-19-a-comprehensive-guide",
  },
  {
    title: "Finding Balance: How to Thrive in a Burnout Culture",
    excerpt: "Practical strategies for maintaining mental health and productivity without sacrificing your well-being in today's fast-paced world...",
    content: `Practical strategies for maintaining mental health and productivity without sacrificing your well-being in today's fast-paced world.

Burnout is a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress. It occurs when you feel overwhelmed, emotionally drained, and unable to meet constant demands.

### Practical Strategies to Prevent Burnout:

1. **Set clear boundaries** between work and personal life.
2. **Practice daily mindfulness** or meditation.
3. **Engage in regular physical activity** to reduce stress hormones.
4. **Prioritize sleep hygiene** and rest.`,
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop",
    tags: ["wellness", "productivity", "mentalhealth"],
    slug: "finding-balance-how-to-thrive-in-burnout-culture",
  },
  {
    title: "The Future of AI: Beyond ChatGPT and Into the Unknown",
    excerpt: "From autonomous agents to multimodal systems, explore what the next generation of AI means for creators, developers, and society...",
    content: `From autonomous agents to multimodal systems, explore what the next generation of AI means for creators, developers, and society.

Artificial intelligence is changing at an exponential pace. We are shifting from simple prompt-response interactions to agentic loops where AI works autonomously on complex tasks.

### Core Trends:
- **Autonomous Agents** that plan, use tools, and execute workflows.
- **Multimodal Models** that seamlessly reason across text, image, audio, and video.
- **On-device AI** that executes quickly without cloud latency.`,
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
    tags: ["ai", "technology", "future"],
    slug: "the-future-of-ai-beyond-chatgpt",
  },
];

async function main() {
  console.log("Seeding database...");

  // 1. Create a Default Author
  const email = "sarah@example.com";
  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  let author;
  if (!existingUser) {
    const hashedPassword = bcrypt.hashSync("password123", 10);
    author = await prisma.user.create({
      data: {
        email,
        name: "Sarah Johnson",
        password: hashedPassword,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        role: "ADMIN"
      }
    });
    console.log(`Created default author: ${author.name}`);
  } else {
    author = existingUser;
    console.log(`Default author already exists: ${author.name}`);
  }

  // 2. Create Posts
  for (const post of postsData) {
    const existingPost = await prisma.post.findUnique({ where: { slug: post.slug } });
    if (!existingPost) {
      const createdPost = await prisma.post.create({
        data: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          tags: post.tags,
          slug: post.slug,
          published: true,
          publishedAt: new Date(),
          authorId: author.id,
          views: Math.floor(Math.random() * 500) + 100,
          likes: Math.floor(Math.random() * 100) + 20,
        }
      });
      console.log(`Created post: ${createdPost.title}`);

      // Seed a few dummy comments on the first post
      if (post.slug === "the-art-of-minimalist-living-finding-joy-in-less") {
        await prisma.comment.createMany({
          data: [
            {
              content: "This is exactly what I needed to read today. I've been feeling overwhelmed by consumerism and this gave me hope.",
              authorId: author.id,
              postId: createdPost.id,
            },
            {
              content: "The 30-day challenge sounds doable! I'm going to start tomorrow. Thank you for the practical advice!",
              authorId: author.id,
              postId: createdPost.id,
            }
          ]
        });
        console.log(`Added comments for ${createdPost.title}`);
      }
    } else {
      console.log(`Post already exists: ${post.title}`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
