/*
  Canonical synonym map.
  Key   = variant the user or JD might write
  Value = canonical form used internally (must be in SKILL_KEYWORDS)

  Rules:
  - All keys and values are lowercase.
  - Do NOT add keys that are ordinary English words ("rest",
    "containers"), short abbreviations that mean other things ("cv",
    "rn", "dl", "pg", "py", "hf"). Ambiguous-but-useful forms ("node", "js", "ts", "ml") are listed here only because they are gated in
    AMBIGUOUS_TERMS (skillKeywords.ts) by case/context.
  - Separator variants ("next js", "ci-cd", "scikit learn") and plurals
    are handled by the matcher; do not list them here.
*/

export const SYNONYMS: Record<string, string> = {
  // JavaScript / TypeScript (bare "js"/"ts" are gated, see AMBIGUOUS_TERMS)
  js: "javascript",
  ts: "typescript",
  es6: "javascript",
  es2015: "javascript",
  ecmascript: "javascript",
  "vanilla js": "javascript",
  "vanilla javascript": "javascript",

  // Frameworks
  reactjs: "react",
  nextjs: "next.js",
  vuejs: "vue",
  angularjs: "angular",
  nodejs: "node.js",
  node: "node.js",
  expressjs: "express",
  nestjs: "nestjs",
  "nest.js": "nestjs",
  "fast api": "fastapi",

  // Databases
  postgres: "postgresql",
  psql: "postgresql",
  mongo: "mongodb",
  "prisma orm": "prisma",
  "sqlalchemy orm": "sqlalchemy",
  "structured query language": "sql",
  mssql: "sql server",
  "microsoft sql server": "sql server",

  // Styling
  tailwindcss: "tailwind",
  "tailwind css": "tailwind",
  scss: "sass",
  html5: "html",
  css3: "css",

  // APIs
  gql: "graphql",
  restful: "rest api",
  "rest services": "rest api",
  "rest endpoints": "rest api",
  "restful services": "rest api",
  websocket: "websockets",
  "web socket": "websockets",

  // Cloud / DevOps
  "amazon web services": "aws",
  "amazon aws": "aws",
  "google cloud": "gcp",
  "google cloud platform": "gcp",
  "microsoft azure": "azure",
  dockerfile: "docker",
  containerization: "docker",
  k8s: "kubernetes",
  kube: "kubernetes",
  cicd: "ci/cd",
  "continuous integration": "ci/cd",
  "continuous deployment": "ci/cd",
  "continuous delivery": "ci/cd",
  "github action": "github actions",

  // AI / ML ("ml" is gated: only uppercase ML counts)
  ml: "machine learning",
  "natural language processing": "nlp",
  "image recognition": "computer vision",
  "hugging face": "huggingface",
  sklearn: "scikit-learn",
  "large language models": "llm",
  "large language model": "llm",
  llms: "llm",
  "apache spark": "spark",
  pyspark: "spark",

  // Languages
  "go lang": "go",
  golang: "go",
  csharp: "c#",
  "c sharp": "c#",
  cpp: "c++",
  "asp.net": ".net",
  dotnet: ".net",

  // Concepts
  "object oriented": "oop",
  "object oriented programming": "oop",
  "data structure": "data structures",
  algorithm: "algorithms",
  microservice: "microservices",
  "message queue": "message queues",
  "agile methodology": "agile",
  "agile development": "agile",
  "scrum methodology": "scrum",

  // Linux
  unix: "linux",
  ubuntu: "linux",
  debian: "linux",
};
