import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a sample learning path
  const frontendPath = await prisma.path.upsert({
    where: { slug: 'frontend-foundations' },
    update: {},
    create: {
      slug: 'frontend-foundations',
      title: 'Frontend Development Foundations',
      summary: 'Master the fundamentals of modern frontend development with HTML, CSS, JavaScript, and React.',
    },
  })

  // Create skills
  const htmlSkill = await prisma.skill.upsert({
    where: { id: 'html-basics' },
    update: {},
    create: {
      id: 'html-basics',
      pathId: frontendPath.id,
      name: 'HTML Basics',
      summary: 'Learn the structure and semantics of HTML documents.',
    },
  })

  const cssSkill = await prisma.skill.upsert({
    where: { id: 'css-styling' },
    update: {},
    create: {
      id: 'css-styling',
      pathId: frontendPath.id,
      name: 'CSS Styling',
      summary: 'Master CSS for styling and layout.',
    },
  })

  const jsSkill = await prisma.skill.upsert({
    where: { id: 'javascript' },
    update: {},
    create: {
      id: 'javascript',
      pathId: frontendPath.id,
      name: 'JavaScript',
      summary: 'Learn JavaScript fundamentals and modern ES6+ features.',
    },
  })

  const reactSkill = await prisma.skill.upsert({
    where: { id: 'react' },
    update: {},
    create: {
      id: 'react',
      pathId: frontendPath.id,
      name: 'React',
      summary: 'Build interactive user interfaces with React.',
    },
  })

  // Create skill dependencies
  await prisma.skillEdge.upsert({
    where: { id: 'html-to-css' },
    update: {},
    create: {
      id: 'html-to-css',
      fromId: htmlSkill.id,
      toId: cssSkill.id,
    },
  })

  await prisma.skillEdge.upsert({
    where: { id: 'css-to-js' },
    update: {},
    create: {
      id: 'css-to-js',
      fromId: cssSkill.id,
      toId: jsSkill.id,
    },
  })

  await prisma.skillEdge.upsert({
    where: { id: 'js-to-react' },
    update: {},
    create: {
      id: 'js-to-react',
      fromId: jsSkill.id,
      toId: reactSkill.id,
    },
  })

  // Create sample lessons
  const lessons = [
    {
      id: 'html-intro',
      title: 'Introduction to HTML',
      contentMd: `# Introduction to HTML

HTML (HyperText Markup Language) is the standard markup language for creating web pages.

## What is HTML?

HTML describes the structure of web pages using markup. HTML elements are the building blocks of HTML pages.

## Basic HTML Structure

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first paragraph.</p>
</body>
</html>
\`\`\`

## Key Concepts

- **Elements**: HTML elements are defined by tags
- **Attributes**: Provide additional information about elements
- **Nesting**: Elements can contain other elements`,
      order: 1,
      skillId: htmlSkill.id,
    },
    {
      id: 'css-intro',
      title: 'Introduction to CSS',
      contentMd: `# Introduction to CSS

CSS (Cascading Style Sheets) is used to style and layout web pages.

## What is CSS?

CSS describes how HTML elements are to be displayed on screen, paper, or in other media.

## Basic CSS Syntax

\`\`\`css
h1 {
    color: blue;
    font-size: 24px;
}

p {
    color: red;
    margin: 10px;
}
\`\`\`

## CSS Selectors

- **Element selectors**: Target HTML elements
- **Class selectors**: Target elements with specific classes
- **ID selectors**: Target elements with specific IDs`,
      order: 1,
      skillId: cssSkill.id,
    },
    {
      id: 'js-intro',
      title: 'JavaScript Fundamentals',
      contentMd: `# JavaScript Fundamentals

JavaScript is a programming language that adds interactivity to web pages.

## Variables

\`\`\`javascript
let name = "John";
const age = 25;
var city = "New York";
\`\`\`

## Functions

\`\`\`javascript
function greet(name) {
    return "Hello, " + name + "!";
}

// Arrow function
const greetArrow = (name) => "Hello, " + name + "!";
\`\`\`

## Arrays and Objects

\`\`\`javascript
const fruits = ["apple", "banana", "orange"];
const person = {
    name: "John",
    age: 25,
    city: "New York"
};
\`\`\``,
      order: 1,
      skillId: jsSkill.id,
    },
    {
      id: 'react-intro',
      title: 'Introduction to React',
      contentMd: `# Introduction to React

React is a JavaScript library for building user interfaces.

## What is React?

React makes it painless to create interactive UIs. Design simple views for each state in your application.

## Components

\`\`\`jsx
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

// Using the component
<Welcome name="Sara" />
\`\`\`

## JSX

JSX is a syntax extension to JavaScript. It looks like HTML but is actually JavaScript.

\`\`\`jsx
const element = <h1>Hello, world!</h1>;
\`\`\`

## State and Props

- **Props**: Pass data to components
- **State**: Manage component data that can change over time`,
      order: 1,
      skillId: reactSkill.id,
    },
  ]

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {},
      create: {
        ...lesson,
        pathId: frontendPath.id,
      },
    })
  }

  // Create sample flashcards
  const flashcards = [
    {
      id: 'html-doctype',
      front: 'What is the purpose of the DOCTYPE declaration in HTML?',
      back: 'The DOCTYPE declaration tells the browser which version of HTML the page is written in. It must be the first line of an HTML document.',
      lessonId: 'html-intro',
    },
    {
      id: 'css-selector',
      front: 'What is a CSS selector?',
      back: 'A CSS selector is a pattern used to select and style HTML elements. It can be an element name, class, ID, or more complex patterns.',
      lessonId: 'css-intro',
    },
    {
      id: 'js-let-const',
      front: 'What is the difference between let and const in JavaScript?',
      back: 'let allows you to declare variables that can be reassigned, while const declares variables that cannot be reassigned after initialization.',
      lessonId: 'js-intro',
    },
    {
      id: 'react-component',
      front: 'What is a React component?',
      back: 'A React component is a reusable piece of UI that can accept inputs (props) and return React elements describing what should appear on the screen.',
      lessonId: 'react-intro',
    },
  ]

  for (const card of flashcards) {
    await prisma.flashcard.upsert({
      where: { id: card.id },
      update: {},
      create: {
        ...card,
        pathId: frontendPath.id,
      },
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
