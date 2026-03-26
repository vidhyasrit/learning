require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please slow down." },
});

const courses = [
  {
    id: 1, title: "JavaScript Mastery", category: "Programming", level: "Beginner",
    duration: "12h 30m", lessons: 42, rating: 4.9, students: 15420,
    instructor: "Alex Chen", image: "js", color: "#F7DF1E",
    description: "Master modern JavaScript from fundamentals to advanced patterns. Build real-world projects and understand the language deeply.",
    tags: ["ES6+", "Async/Await", "DOM", "APIs"], progress: 0,
    chapters: [
      { id: 1, title: "Variables & Data Types", duration: "45m", completed: false },
      { id: 2, title: "Functions & Scope", duration: "1h 10m", completed: false },
      { id: 3, title: "Arrays & Objects", duration: "55m", completed: false },
      { id: 4, title: "Async JavaScript", duration: "1h 30m", completed: false },
      { id: 5, title: "DOM Manipulation", duration: "1h 15m", completed: false },
    ],
  },
  {
    id: 2, title: "React & Next.js", category: "Frontend", level: "Intermediate",
    duration: "18h 45m", lessons: 65, rating: 4.8, students: 12300,
    instructor: "Sarah Miller", image: "react", color: "#61DAFB",
    description: "Build production-ready React apps with Next.js. Learn hooks, context, server components and deploy to the cloud.",
    tags: ["Hooks", "Context", "SSR", "TypeScript"], progress: 0,
    chapters: [
      { id: 1, title: "React Fundamentals", duration: "1h 20m", completed: false },
      { id: 2, title: "Hooks Deep Dive", duration: "2h 00m", completed: false },
      { id: 3, title: "State Management", duration: "1h 45m", completed: false },
      { id: 4, title: "Next.js Routing", duration: "1h 30m", completed: false },
      { id: 5, title: "Deployment & CI/CD", duration: "50m", completed: false },
    ],
  },
  {
    id: 3, title: "Python for Data Science", category: "Data Science", level: "Beginner",
    duration: "22h 00m", lessons: 78, rating: 4.9, students: 20100,
    instructor: "Dr. Priya Patel", image: "python", color: "#3776AB",
    description: "From Python basics to advanced data analysis. Master NumPy, Pandas, Matplotlib and build ML models.",
    tags: ["NumPy", "Pandas", "ML", "Visualization"], progress: 0,
    chapters: [
      { id: 1, title: "Python Basics", duration: "1h 00m", completed: false },
      { id: 2, title: "NumPy Arrays", duration: "1h 30m", completed: false },
      { id: 3, title: "Pandas DataFrames", duration: "2h 00m", completed: false },
      { id: 4, title: "Data Visualization", duration: "1h 20m", completed: false },
      { id: 5, title: "ML with sklearn", duration: "2h 30m", completed: false },
    ],
  },
  {
    id: 4, title: "UI/UX Design Systems", category: "Design", level: "Intermediate",
    duration: "14h 20m", lessons: 50, rating: 4.7, students: 8900,
    instructor: "Marco Rossi", image: "design", color: "#FF7262",
    description: "Design beautiful, accessible interfaces. Learn Figma, design tokens, component libraries and user research.",
    tags: ["Figma", "Accessibility", "Design Tokens", "UX Research"], progress: 0,
    chapters: [
      { id: 1, title: "Design Principles", duration: "1h 10m", completed: false },
      { id: 2, title: "Figma Mastery", duration: "2h 00m", completed: false },
      { id: 3, title: "Component Libraries", duration: "1h 45m", completed: false },
      { id: 4, title: "User Research", duration: "1h 30m", completed: false },
      { id: 5, title: "Prototyping", duration: "1h 00m", completed: false },
    ],
  },
  {
    id: 5, title: "Node.js & Express APIs", category: "Backend", level: "Intermediate",
    duration: "16h 10m", lessons: 58, rating: 4.8, students: 11200,
    instructor: "James Wilson", image: "node", color: "#68A063",
    description: "Build scalable REST APIs with Node.js and Express. Learn authentication, databases, caching and deployment.",
    tags: ["REST", "JWT", "MongoDB", "Redis"], progress: 0,
    chapters: [
      { id: 1, title: "Node.js Fundamentals", duration: "1h 20m", completed: false },
      { id: 2, title: "Express Framework", duration: "1h 40m", completed: false },
      { id: 3, title: "Database Integration", duration: "2h 00m", completed: false },
      { id: 4, title: "Authentication & Security", duration: "1h 50m", completed: false },
      { id: 5, title: "Performance & Scaling", duration: "1h 30m", completed: false },
    ],
  },
  {
    id: 6, title: "Machine Learning A-Z", category: "AI/ML", level: "Advanced",
    duration: "30h 00m", lessons: 110, rating: 4.9, students: 25000,
    instructor: "Dr. Lena Kovacs", image: "ml", color: "#FF6B6B",
    description: "Complete ML journey from regression to deep learning. Implement algorithms from scratch and use modern frameworks.",
    tags: ["TensorFlow", "PyTorch", "Deep Learning", "NLP"], progress: 0,
    chapters: [
      { id: 1, title: "ML Fundamentals", duration: "2h 00m", completed: false },
      { id: 2, title: "Supervised Learning", duration: "3h 00m", completed: false },
      { id: 3, title: "Neural Networks", duration: "3h 30m", completed: false },
      { id: 4, title: "Deep Learning", duration: "4h 00m", completed: false },
      { id: 5, title: "NLP & Transformers", duration: "3h 00m", completed: false },
    ],
  },
  {
    id: 7, title: "TypeScript Complete Guide", category: "Programming", level: "Intermediate",
    duration: "14h 00m", lessons: 52, rating: 4.8, students: 9800,
    instructor: "Emily Zhang", image: "js", color: "#3178C6",
    description: "Master TypeScript from basics to advanced generics. Write safer, scalable code with full type coverage in any project.",
    tags: ["Types", "Generics", "Interfaces", "Decorators"], progress: 0,
    chapters: [
      { id: 1, title: "TypeScript Basics", duration: "1h 00m", completed: false },
      { id: 2, title: "Interfaces & Types", duration: "1h 20m", completed: false },
      { id: 3, title: "Generics", duration: "1h 30m", completed: false },
      { id: 4, title: "Advanced Types", duration: "1h 40m", completed: false },
      { id: 5, title: "TypeScript with React", duration: "1h 30m", completed: false },
    ],
  },
  {
    id: 8, title: "Flutter & Dart Mobile Dev", category: "Mobile", level: "Intermediate",
    duration: "20h 00m", lessons: 72, rating: 4.7, students: 13400,
    instructor: "Raj Mehta", image: "mobile", color: "#54C5F8",
    description: "Build beautiful cross-platform mobile apps with Flutter. Deploy to iOS and Android from a single codebase.",
    tags: ["Flutter", "Dart", "iOS", "Android"], progress: 0,
    chapters: [
      { id: 1, title: "Dart Fundamentals", duration: "1h 30m", completed: false },
      { id: 2, title: "Flutter Widgets", duration: "2h 00m", completed: false },
      { id: 3, title: "State Management", duration: "2h 00m", completed: false },
      { id: 4, title: "Navigation & Routing", duration: "1h 30m", completed: false },
      { id: 5, title: "Publishing to Stores", duration: "1h 00m", completed: false },
    ],
  },
  {
    id: 9, title: "AWS Cloud Practitioner", category: "Cloud", level: "Beginner",
    duration: "17h 30m", lessons: 60, rating: 4.8, students: 18700,
    instructor: "David Kim", image: "cloud", color: "#FF9900",
    description: "Learn AWS cloud fundamentals and pass the AWS Certified Cloud Practitioner exam. Covers core services and architecture.",
    tags: ["EC2", "S3", "Lambda", "IAM"], progress: 0,
    chapters: [
      { id: 1, title: "Cloud Fundamentals", duration: "1h 00m", completed: false },
      { id: 2, title: "Core AWS Services", duration: "2h 30m", completed: false },
      { id: 3, title: "Security & Compliance", duration: "1h 30m", completed: false },
      { id: 4, title: "Pricing & Billing", duration: "1h 00m", completed: false },
      { id: 5, title: "Exam Preparation", duration: "2h 00m", completed: false },
    ],
  },
  {
    id: 10, title: "Docker & Kubernetes", category: "DevOps", level: "Intermediate",
    duration: "19h 00m", lessons: 68, rating: 4.9, students: 14200,
    instructor: "Nina Petrov", image: "devops", color: "#2496ED",
    description: "Master containerization with Docker and orchestration with Kubernetes. Deploy and scale apps in production.",
    tags: ["Docker", "Kubernetes", "CI/CD", "Helm"], progress: 0,
    chapters: [
      { id: 1, title: "Docker Basics", duration: "1h 30m", completed: false },
      { id: 2, title: "Docker Compose", duration: "1h 30m", completed: false },
      { id: 3, title: "Kubernetes Architecture", duration: "2h 00m", completed: false },
      { id: 4, title: "Deployments & Services", duration: "2h 00m", completed: false },
      { id: 5, title: "Production Best Practices", duration: "1h 30m", completed: false },
    ],
  },
  {
    id: 11, title: "SQL & PostgreSQL Mastery", category: "Database", level: "Beginner",
    duration: "13h 00m", lessons: 46, rating: 4.7, students: 16500,
    instructor: "Carlos Mendez", image: "db", color: "#336791",
    description: "Learn SQL from scratch to advanced queries. Master PostgreSQL, indexing, transactions and database design.",
    tags: ["SQL", "PostgreSQL", "Indexing", "Transactions"], progress: 0,
    chapters: [
      { id: 1, title: "SQL Basics", duration: "1h 00m", completed: false },
      { id: 2, title: "Joins & Subqueries", duration: "1h 30m", completed: false },
      { id: 3, title: "Database Design", duration: "1h 30m", completed: false },
      { id: 4, title: "Performance Tuning", duration: "1h 20m", completed: false },
      { id: 5, title: "Advanced PostgreSQL", duration: "1h 30m", completed: false },
    ],
  },
  {
    id: 12, title: "Cybersecurity Fundamentals", category: "Security", level: "Beginner",
    duration: "15h 00m", lessons: 54, rating: 4.8, students: 11800,
    instructor: "Hassan Al-Rashid", image: "security", color: "#EF4444",
    description: "Learn essential cybersecurity concepts, ethical hacking basics, network security and how to protect systems.",
    tags: ["Ethical Hacking", "Network Security", "OWASP", "Penetration Testing"], progress: 0,
    chapters: [
      { id: 1, title: "Security Fundamentals", duration: "1h 00m", completed: false },
      { id: 2, title: "Network Security", duration: "1h 30m", completed: false },
      { id: 3, title: "Web Application Security", duration: "2h 00m", completed: false },
      { id: 4, title: "Penetration Testing", duration: "2h 00m", completed: false },
      { id: 5, title: "Security Tools", duration: "1h 30m", completed: false },
    ],
  },
  {
    id: 13, title: "Vue.js 3 Complete Course", category: "Frontend", level: "Intermediate",
    duration: "16h 30m", lessons: 59, rating: 4.7, students: 8600,
    instructor: "Sophie Laurent", image: "react", color: "#42B883",
    description: "Master Vue.js 3 with the Composition API, Pinia state management, Vue Router and build real-world applications.",
    tags: ["Vue 3", "Composition API", "Pinia", "Vue Router"], progress: 0,
    chapters: [
      { id: 1, title: "Vue 3 Basics", duration: "1h 20m", completed: false },
      { id: 2, title: "Composition API", duration: "2h 00m", completed: false },
      { id: 3, title: "Pinia State Management", duration: "1h 30m", completed: false },
      { id: 4, title: "Vue Router", duration: "1h 20m", completed: false },
      { id: 5, title: "Testing Vue Apps", duration: "1h 10m", completed: false },
    ],
  },
  {
    id: 14, title: "GraphQL & Apollo", category: "Backend", level: "Advanced",
    duration: "14h 00m", lessons: 50, rating: 4.6, students: 7200,
    instructor: "Maya Johnson", image: "node", color: "#E10098",
    description: "Build powerful APIs with GraphQL and Apollo. Replace REST with flexible, efficient data fetching for modern apps.",
    tags: ["GraphQL", "Apollo Server", "Mutations", "Subscriptions"], progress: 0,
    chapters: [
      { id: 1, title: "GraphQL Basics", duration: "1h 00m", completed: false },
      { id: 2, title: "Schemas & Resolvers", duration: "1h 30m", completed: false },
      { id: 3, title: "Apollo Client", duration: "1h 30m", completed: false },
      { id: 4, title: "Mutations & Subscriptions", duration: "1h 20m", completed: false },
      { id: 5, title: "Production GraphQL", duration: "1h 30m", completed: false },
    ],
  },
  {
    id: 15, title: "iOS Development with Swift", category: "Mobile", level: "Intermediate",
    duration: "24h 00m", lessons: 85, rating: 4.8, students: 9100,
    instructor: "Tom Bradley", image: "mobile", color: "#F05138",
    description: "Build native iOS apps with Swift and SwiftUI. From beginner to App Store — cover UIKit, networking and CoreData.",
    tags: ["Swift", "SwiftUI", "UIKit", "CoreData"], progress: 0,
    chapters: [
      { id: 1, title: "Swift Fundamentals", duration: "2h 00m", completed: false },
      { id: 2, title: "SwiftUI Basics", duration: "2h 30m", completed: false },
      { id: 3, title: "Navigation & Lists", duration: "1h 30m", completed: false },
      { id: 4, title: "Networking & APIs", duration: "2h 00m", completed: false },
      { id: 5, title: "App Store Submission", duration: "1h 00m", completed: false },
    ],
  },
  {
    id: 16, title: "Apache Spark & Data Engineering", category: "Data Science", level: "Advanced",
    duration: "26h 00m", lessons: 92, rating: 4.7, students: 6800,
    instructor: "Dr. Wei Liu", image: "python", color: "#E25A1C",
    description: "Process massive datasets with Apache Spark and PySpark. Build data pipelines, ETL processes and streaming jobs.",
    tags: ["PySpark", "ETL", "Hadoop", "Kafka"], progress: 0,
    chapters: [
      { id: 1, title: "Spark Architecture", duration: "1h 30m", completed: false },
      { id: 2, title: "RDDs & DataFrames", duration: "2h 00m", completed: false },
      { id: 3, title: "Spark SQL", duration: "2h 00m", completed: false },
      { id: 4, title: "Streaming with Kafka", duration: "2h 30m", completed: false },
      { id: 5, title: "Pipeline Orchestration", duration: "2h 00m", completed: false },
    ],
  },
  {
    id: 17, title: "Prompt Engineering & LLMs", category: "AI/ML", level: "Beginner",
    duration: "10h 00m", lessons: 36, rating: 4.9, students: 22000,
    instructor: "Aisha Okonkwo", image: "ml", color: "#8B5CF6",
    description: "Learn to craft effective prompts for ChatGPT, Claude and other LLMs. Build AI-powered apps and automate workflows.",
    tags: ["Prompt Engineering", "ChatGPT", "Claude", "LangChain"], progress: 0,
    chapters: [
      { id: 1, title: "LLM Fundamentals", duration: "1h 00m", completed: false },
      { id: 2, title: "Prompt Techniques", duration: "1h 30m", completed: false },
      { id: 3, title: "Chain of Thought", duration: "1h 00m", completed: false },
      { id: 4, title: "LangChain Basics", duration: "1h 30m", completed: false },
      { id: 5, title: "Building AI Apps", duration: "2h 00m", completed: false },
    ],
  },
  {
    id: 18, title: "Rust Programming Language", category: "Programming", level: "Advanced",
    duration: "28h 00m", lessons: 98, rating: 4.8, students: 5400,
    instructor: "Felix Wagner", image: "js", color: "#CE422B",
    description: "Learn Rust — systems programming focused on safety, speed and concurrency. Build CLI tools and WebAssembly apps.",
    tags: ["Ownership", "Borrowing", "Concurrency", "WebAssembly"], progress: 0,
    chapters: [
      { id: 1, title: "Rust Basics", duration: "2h 00m", completed: false },
      { id: 2, title: "Ownership & Borrowing", duration: "2h 30m", completed: false },
      { id: 3, title: "Structs & Enums", duration: "1h 30m", completed: false },
      { id: 4, title: "Concurrency", duration: "2h 00m", completed: false },
      { id: 5, title: "WebAssembly with Rust", duration: "2h 00m", completed: false },
    ],
  },
  {
    id: 19, title: "Motion Design with After Effects", category: "Design", level: "Beginner",
    duration: "12h 30m", lessons: 44, rating: 4.6, students: 7700,
    instructor: "Lucia Fernandez", image: "design", color: "#9999FF",
    description: "Create stunning motion graphics and animations with Adobe After Effects. From basics to professional animations.",
    tags: ["After Effects", "Motion Graphics", "Animation", "Compositing"], progress: 0,
    chapters: [
      { id: 1, title: "After Effects Interface", duration: "45m", completed: false },
      { id: 2, title: "Keyframe Animation", duration: "1h 20m", completed: false },
      { id: 3, title: "Motion Paths", duration: "1h 10m", completed: false },
      { id: 4, title: "Text Animation", duration: "1h 00m", completed: false },
      { id: 5, title: "Exporting & Delivery", duration: "45m", completed: false },
    ],
  },
  {
    id: 20, title: "Terraform & Infrastructure as Code", category: "DevOps", level: "Intermediate",
    duration: "15h 00m", lessons: 54, rating: 4.8, students: 10300,
    instructor: "Omar Hassan", image: "devops", color: "#7B42BC",
    description: "Automate cloud infrastructure with Terraform. Manage AWS, GCP and Azure resources using code with best practices.",
    tags: ["Terraform", "AWS", "IaC", "Modules"], progress: 0,
    chapters: [
      { id: 1, title: "IaC Fundamentals", duration: "1h 00m", completed: false },
      { id: 2, title: "Terraform Basics", duration: "1h 30m", completed: false },
      { id: 3, title: "Variables & Modules", duration: "1h 30m", completed: false },
      { id: 4, title: "Remote State", duration: "1h 00m", completed: false },
      { id: 5, title: "Multi-cloud Deployment", duration: "1h 30m", completed: false },
    ],
  },
];

app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.get("/api/courses", (req, res) => {
  const { category, level, search } = req.query;
  let filtered = [...courses];
  if (category && category !== "All") filtered = filtered.filter(c => c.category === category);
  if (level && level !== "All") filtered = filtered.filter(c => c.level === level);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q)) ||
      c.category.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q)
    );
  }
  res.json({ courses: filtered, total: filtered.length });
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json(course);
});

app.get("/api/categories", (req, res) => {
  res.json(["All", ...new Set(courses.map(c => c.category))]);
});

app.post("/api/chat", chatLimiter, async (req, res) => {
  const { messages, courseContext } = req.body;
  if (!messages || !Array.isArray(messages))
    return res.status(400).json({ error: "Messages array is required" });

  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey)
    return res.status(500).json({ error: "AI service not configured. Add COHERE_API_KEY to .env" });

  const systemPrompt = courseContext
    ? `You are an expert learning assistant for LearnAI. Helping with: "${courseContext.title}" (${courseContext.category}, ${courseContext.level}).
Description: ${courseContext.description}
Topics: ${courseContext.tags?.join(", ")}
Answer clearly with code examples, encourage the student, suggest next steps.`
    : `You are an expert AI learning assistant for LearnAI — a platform with 20 courses.
Available courses:
${courses.map(c => `- ${c.title} (${c.category}, ${c.level})`).join("\n")}
Help students find courses, explain concepts, debug code, plan learning paths. Be friendly and educational.`;

  try {
    const response = await fetch("https://api.cohere.com/v2/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "command-a-03-2025",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 1024,
      }),
    });
    if (!response.ok) {
      const err = await response.json();
      console.error("Cohere error:", err);
      return res.status(502).json({ error: "AI service error. Please try again." });
    }
    const data = await response.json();
    const reply = data.message?.content?.[0]?.text || "Could not generate a response.";
    res.json({ reply, tokens: data.usage });
  } catch (err) {
    console.error("Chat error:", err); 
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 LearnAI Backend running on http://localhost:${PORT}`);
  console.log(`📚 ${courses.length} courses loaded`);
  console.log(`🤖 AI Chat: ${process.env.COHERE_API_KEY ? "✅ Configured" : "❌ Missing COHERE_API_KEY"}\n`);
});
