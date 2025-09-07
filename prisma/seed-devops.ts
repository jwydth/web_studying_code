// prisma/seed-devops.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding DevOps & Cloud path...");
  const path = await prisma.path.upsert({
    where: { slug: "devops-cloud" },
    update: {},
    create: {
      slug: "devops-cloud",
      title: "DevOps & Cloud Computing",
      summary:
        "Deploy, scale, and manage applications in the cloud with modern DevOps practices.",
    },
  });

  const docker = await prisma.skill.upsert({
    where: { id: "docker" },
    update: {},
    create: {
      id: "docker",
      pathId: path.id,
      name: "Docker",
      summary: "Containerization fundamentals.",
    },
  });
  const cicd = await prisma.skill.upsert({
    where: { id: "cicd" },
    update: {},
    create: {
      id: "cicd",
      pathId: path.id,
      name: "CI/CD",
      summary: "Automated build, test, and deploy.",
    },
  });
  const aws = await prisma.skill.upsert({
    where: { id: "aws" },
    update: {},
    create: {
      id: "aws",
      pathId: path.id,
      name: "AWS",
      summary: "Core AWS services & IAM.",
    },
  });
  const k8s = await prisma.skill.upsert({
    where: { id: "kubernetes" },
    update: {},
    create: {
      id: "kubernetes",
      pathId: path.id,
      name: "Kubernetes",
      summary: "Orchestration with k8s.",
    },
  });

  // Edges (DAG)
  await prisma.skillEdge.upsert({
    where: { id: "docker-to-cicd" },
    update: {},
    create: { id: "docker-to-cicd", fromId: docker.id, toId: cicd.id },
  });
  await prisma.skillEdge.upsert({
    where: { id: "docker-to-k8s" },
    update: {},
    create: { id: "docker-to-k8s", fromId: docker.id, toId: k8s.id },
  });
  await prisma.skillEdge.upsert({
    where: { id: "cicd-to-aws" },
    update: {},
    create: { id: "cicd-to-aws", fromId: cicd.id, toId: aws.id },
  });

  // Lessons
  const lessons = [
    {
      id: "docker-intro",
      skillId: docker.id,
      title: "Docker Fundamentals",
      contentMd: `# Docker Fundamentals

**Image vs Container:** An image is a template; a container is a running instance.

## Try basic commands

\`\`\`bash
docker --version
docker run -it --rm alpine:3.19 echo "hello"
docker ps -a
\`\`\`

## Minimal Dockerfile

\`\`\`dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]
\`\`\`
`,
      order: 1,
    },
    {
      id: "cicd-intro",
      skillId: cicd.id,
      title: "Intro to CI/CD",
      contentMd: `# Intro to CI/CD

CI builds and tests your code automatically. CD deploys it safely.

## Example GitHub Actions

\`\`\`yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm test --if-present
\`\`\`
`,
      order: 1,
    },
    {
      id: "aws-intro",
      skillId: aws.id,
      title: "AWS Basics",
      contentMd: `# AWS Basics

Core services: IAM, S3, EC2, CloudWatch.

- **IAM**: users/roles/policies  
- **S3**: object storage  
- **EC2**: compute instances

\`\`\`bash
aws s3 ls
aws sts get-caller-identity
\`\`\`
`,
      order: 1,
    },
    {
      id: "k8s-intro",
      skillId: k8s.id,
      title: "Kubernetes Essentials",
      contentMd: `# Kubernetes Essentials

Pods, Deployments, Services.

## Minimal Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: web }
spec:
  replicas: 2
  selector: { matchLabels: { app: web } }
  template:
    metadata: { labels: { app: web } }
    spec:
      containers:
        - name: web
          image: nginx:1.27-alpine
          ports: [{ containerPort: 80 }]
\`\`\`
`,
      order: 1,
    },
  ];

  for (const l of lessons) {
    await prisma.lesson.upsert({
      where: { id: l.id },
      update: {},
      create: { ...l, pathId: path.id },
    });
  }

  console.log("✅ DevOps path seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
