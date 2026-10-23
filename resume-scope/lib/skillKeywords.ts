export const SKILL_KEYWORDS = [
  // Frontend
  "html",
  "css",
  "javascript",
  "typescript",
  "react",
  "next.js",
  "vue",
  "angular",
  "redux",
  "zustand",
  "tailwind",
  "bootstrap",
  "sass",
  "vite",
  "webpack",
  "framer motion",

  // Backend
  "node.js",
  "express",
  "nestjs",
  "fastapi",
  "django",
  "flask",
  "spring boot",
  "go",
  "rust",
  "graphql",
  "rest api",
  "grpc",
  "trpc",
  "websockets",

  // Databases
  "mongodb",
  "mysql",
  "postgresql",
  "sqlite",
  "redis",
  "firebase",
  "supabase",
  "prisma",
  "drizzle",
  "mongoose",
  "sqlalchemy",
  "sql server",

  // Languages
  "python",
  "java",
  "c",
  "c++",
  "c#",
  ".net",
  "sql",
  "kotlin",
  "swift",
  "php",
  "ruby",
  "scala",

  // Cloud / DevOps
  "aws",
  "gcp",
  "azure",
  "docker",
  "kubernetes",
  "terraform",
  "ansible",
  "vercel",
  "netlify",
  "railway",
  "ci/cd",
  "github actions",
  "jenkins",
  "nginx",

  // AI / ML
  "machine learning",
  "deep learning",
  "tensorflow",
  "pytorch",
  "scikit-learn",
  "opencv",
  "huggingface",
  "langchain",
  "openai",
  "nlp",
  "computer vision",
  "llm",
  "data science",
  "data engineering",
  "pandas",
  "numpy",
  "matplotlib",

  // Testing
  "jest",
  "vitest",
  "cypress",
  "playwright",
  "pytest",
  "junit",
  "testing library",

  // Tools
  "git",
  "github",
  "gitlab",
  "version control",
  "postman",
  "figma",
  "jira",
  "linux",
  "bash",
  "zod",
  "shadcn",

  // Concepts
  "microservices",
  "data structures",
  "algorithms",
  "oop",
  "system design",
  "agile",
  "scrum",
  "accessibility",
  "responsive design",
  "authentication",
  "authorization",
  "caching",
  "message queues",

  // Data Engineering
  "kafka",
  "spark",
  "airflow",
  "dbt",
  "etl",
  "bigquery",
  "snowflake",

  // Mobile
  "react native",
  "flutter",
];

/*
  Hierarchy: a JD skill (key) is satisfied by the resume having any of
  the listed skills. The relation is one-directional: GitHub satisfies
  Git, but Git does not satisfy GitHub.
*/
export const SKILL_SATISFIED_BY: Record<string, string[]> = {
  git: ["github", "gitlab"],
  "version control": ["git", "github", "gitlab"],
  sql: ["postgresql", "mysql", "sqlite", "sql server"],
  react: ["next.js"],
};

/*
  Ambiguous surface forms. These words are also ordinary English or
  mean something else, so a match only counts when:
    - the original capitalization is one of `caseSensitive`, AND
    - the same line contains tech `context` (if given), AND
    - the text right after the match does not look like prose (`deny`).
  `lowerContext` lets a wrongly-cased match through when the line is
  clearly technical (e.g. an all-lowercase skills list).
  Keys are the lowercase surface form.
*/
export interface AmbiguityRule {
  caseSensitive: string[];
  context?: RegExp;
  lowerContext?: RegExp;
  deny?: RegExp;
  /** Replaces the generated boundary pattern (used for single letters). */
  pattern?: string;
}

const words = (list: string) => new RegExp(`\\b(?:${list})\\b`, "i");
const withSymbols = (list: string) =>
  new RegExp(`c\\+\\+|c#|\\b(?:${list})\\b`, "i");

const LANGUAGE_CONTEXT =
  "python|java|javascript|typescript|rust|golang|ruby|kotlin|programming|language|languages|embedded|systems|compiler|kernel|firmware|developer|engineer|proficiency|backend|microservices?|concurrency|kubernetes|docker|grpc";
const DATA_CONTEXT =
  "apache|hadoop|pyspark|scala|kafka|airflow|etl|databricks|big data|cluster|pipelines?|sql|data|warehouse|dbt|bigquery|analytics|streaming|messaging|queues?|events?|consumers?|producers?|topics?|microservices?|cloud";
const NODE_CONTEXT =
  "js|javascript|typescript|express|npm|react|backend|server|mongodb|api|apis|nestjs";

export const AMBIGUOUS_TERMS: Record<string, AmbiguityRule> = {
  c: {
    caseSensitive: ["C"],
    context: withSymbols(LANGUAGE_CONTEXT),
    pattern:
      "(?<![A-Za-z0-9_+#.\\-])c(?![A-Za-z0-9_+#\\-]|\\.[A-Za-z0-9])",
  },
  go: {
    caseSensitive: ["Go"],
    context: withSymbols(LANGUAGE_CONTEXT + "|software|api|apis"),
    deny: /^[\s-]+(?:ahead|to|beyond|above|for|live|through|back|over|the|further|big)\b/i,
  },
  react: {
    caseSensitive: ["React", "REACT"],
    lowerContext: words(
      "js|javascript|typescript|frontend|front-end|redux|next|components?|hooks|node|tailwind|web|ui"
    ),
    deny: /^\s+(?:to|quickly|fast|well|positively|appropriately|accordingly|swiftly|promptly|effectively)\b/i,
  },
  express: {
    caseSensitive: ["Express"],
    context: words(
      "node|npm|react|javascript|typescript|api|apis|backend|server|middleware|mongodb|rest|restful"
    ),
  },
  node: { caseSensitive: ["Node"], context: words(NODE_CONTEXT) },
  spark: { caseSensitive: ["Spark"], context: words(DATA_CONTEXT) },
  kafka: { caseSensitive: ["Kafka"], context: words(DATA_CONTEXT) },
  snowflake: { caseSensitive: ["Snowflake"], context: words(DATA_CONTEXT) },
  railway: {
    caseSensitive: ["Railway"],
    context: words(
      "deploy|deployed|deployment|hosting|vercel|heroku|netlify|cloud|app|apps|postgres|docker|backend"
    ),
  },
  drizzle: {
    caseSensitive: ["Drizzle"],
    context: words("orm|sql|typescript|postgres|postgresql|database|schema|mysql"),
  },
  mongoose: {
    caseSensitive: ["Mongoose"],
    context: words("mongodb|node|schema|odm|express|database"),
  },
  swift: {
    caseSensitive: ["Swift"],
    context: words("ios|xcode|apple|swiftui|mobile|objective-c|iphone|app|apps|kotlin"),
  },
  rust: { caseSensitive: ["Rust"] },
  scala: { caseSensitive: ["Scala"] },
  ruby: {
    caseSensitive: ["Ruby"],
    context: words(
      "rails|gems?|rubygems|programming|language|developer|engineer|backend|rspec|sinatra|python|javascript"
    ),
  },
  flask: {
    caseSensitive: ["Flask"],
    context: words("python|api|apis|django|backend|framework|sqlalchemy|web"),
  },
  bash: {
    caseSensitive: ["Bash", "bash"],
    context: words("script|scripts|scripting|shell|linux|unix|terminal|cli|git|docker"),
  },
  js: { caseSensitive: ["JS", "js"] },
  ts: { caseSensitive: ["TS"], deny: /^\/sci\b/i },
  ml: { caseSensitive: ["ML"] },
};
