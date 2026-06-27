/*
  Canonical synonym map.
  Key   = variant the user or JD might write
  Value = canonical form used internally

  Rules:
  - All keys and values are lowercase
  - Value must match an entry in SKILL_KEYWORDS or be a known phrase
  - Add new variants here; do not scatter normalization across files
*/

export const SYNONYMS: Record<string, string> = {
  // JavaScript
  "js": "javascript",
  "es6": "javascript",
  "es2015": "javascript",
  "ecmascript": "javascript",
  "vanilla js": "javascript",
  "vanilla javascript": "javascript",

  // TypeScript
  "ts": "typescript",

  // React
  "reactjs": "react",
  "react.js": "react",
  "react js": "react",

  // Next.js
  "nextjs": "next.js",
  "next js": "next.js",

  // Vue
  "vuejs": "vue",
  "vue.js": "vue",

  // Angular
  "angularjs": "angular",
  "angular.js": "angular",

  // Node.js
  "node": "node.js",
  "nodejs": "node.js",
  "node js": "node.js",

  // Express
  "expressjs": "express",
  "express.js": "express",

  // Python
  "py": "python",

  // PostgreSQL
  "postgres": "postgresql",
  "psql": "postgresql",
  "pg": "postgresql",

  // MongoDB
  "mongo": "mongodb",

  // Tailwind
  "tailwindcss": "tailwind",
  "tailwind css": "tailwind",

  // GraphQL
  "gql": "graphql",

  // REST API
  "rest": "rest api",
  "restful": "rest api",
  "restful api": "rest api",
  "rest apis": "rest api",
  "restful apis": "rest api",

  // AWS
  "amazon web services": "aws",
  "amazon aws": "aws",

  // GCP
  "google cloud": "gcp",
  "google cloud platform": "gcp",

  // Azure
  "microsoft azure": "azure",

  // Docker
  "dockerfile": "docker",
  "containerization": "docker",
  "containers": "docker",

  // Kubernetes
  "k8s": "kubernetes",
  "kube": "kubernetes",

  // CI/CD
  "ci cd": "ci/cd",
  "cicd": "ci/cd",
  "continuous integration": "ci/cd",
  "continuous deployment": "ci/cd",
  "continuous delivery": "ci/cd",

  // GitHub Actions
  "github action": "github actions",

  // Machine Learning
  "ml": "machine learning",

  // Deep Learning
  "dl": "deep learning",

  // NLP
  "natural language processing": "nlp",

  // Computer Vision
  "cv": "computer vision",
  "image recognition": "computer vision",

  // React Native
  "rn": "react native",

  // Golang
  "go lang": "go",
  "golang": "go",

  // C#
  "csharp": "c#",
  "c sharp": "c#",

  // C++
  "cpp": "c++",

  // SQL
  "structured query language": "sql",

  // WebSockets
  "websocket": "websockets",
  "web sockets": "websockets",
  "web socket": "websockets",

  // Sass
  "scss": "sass",

  // Prisma
  "prisma orm": "prisma",

  // SQLAlchemy
  "sqlalchemy orm": "sqlalchemy",

  // HuggingFace
  "hugging face": "huggingface",
  "hf": "huggingface",

  // FastAPI
  "fast api": "fastapi",

  // NestJS
  "nest.js": "nestjs",
  "nest js": "nestjs",

  // tRPC
  "trpc": "trpc",

  // Git
  "version control": "git",

  // Linux
  "unix": "linux",
  "ubuntu": "linux",
  "debian": "linux",

  // Agile
  "agile methodology": "agile",
  "agile development": "agile",

  // Scrum
  "scrum methodology": "scrum",
};