import "dotenv/config";

import { db } from "../src/lib/db.js";
import { jobs } from "../src/lib/schema.js";

async function seedJobs() {
  const data = [
    {
      title: "Next.js Developer",
      companyName: "ScaleStack Technologies",
      description: `ScaleStack Technologies is looking for a Next.js Developer to build high-performance web applications for our growing SaaS platform. You will work closely with product designers, backend engineers, and DevOps teams to develop scalable features, improve application performance, and ensure an exceptional user experience. The ideal candidate is passionate about modern frontend technologies, server-side rendering, and writing clean, maintainable code.`,

      requirements: `• 3+ years of experience with React.js and Next.js
• Strong understanding of App Router, Server Components, and API Routes
• Experience with Tailwind CSS and modern UI development
• Familiarity with SSR, SSG, and performance optimization
• Experience integrating REST APIs and authentication systems
• Knowledge of TypeScript is preferred
• Experience with Git, GitHub, and collaborative development workflows
• Understanding of SEO best practices and responsive design
• Strong communication and problem-solving skills`,
    },

    {
      title: "Software Engineer",
      companyName: "InnovateX Labs",
      description: `InnovateX Labs is seeking a Software Engineer to design, develop, and maintain scalable software solutions used by thousands of customers. You will collaborate with cross-functional teams to build new features, improve existing systems, and ensure software reliability through testing and code reviews. This role is ideal for engineers who enjoy solving complex technical challenges and building production-ready applications.`,

      requirements: `• Bachelor's degree in Computer Science or equivalent experience
• 2+ years of software development experience
• Strong knowledge of JavaScript, TypeScript, or Python
• Experience with relational databases such as PostgreSQL or MySQL
• Familiarity with RESTful APIs and modern backend development
• Experience with Git and Agile development methodologies
• Understanding of software architecture and design patterns
• Strong analytical and debugging skills
• Excellent communication and teamwork abilities`,
    },

    {
      title: "DevOps Engineer",
      companyName: "CloudSphere",
      description: `CloudSphere is hiring a DevOps Engineer to help build and maintain reliable cloud infrastructure for our products. You will automate deployments, improve CI/CD pipelines, monitor production environments, and collaborate with engineering teams to ensure high availability and system performance.`,

      requirements: `• 3+ years of DevOps or Infrastructure experience
• Experience with AWS services such as EC2, S3, RDS, and IAM
• Strong knowledge of Docker and containerization
• Experience with Kubernetes is highly preferred
• Familiarity with CI/CD pipelines using GitHub Actions or Jenkins
• Knowledge of Linux system administration
• Experience with Infrastructure as Code tools such as Terraform
• Understanding of monitoring and logging solutions
• Strong troubleshooting and automation skills`,
    },

    {
      title: "AI Engineer",
      companyName: "VisionMind AI",
      description: `VisionMind AI is looking for an AI Engineer to develop intelligent applications powered by Large Language Models and modern AI frameworks. You will design AI workflows, integrate LLM APIs, optimize prompts, and collaborate with product teams to deliver innovative AI-powered features for enterprise customers.`,

      requirements: `• Strong proficiency in Python
• Experience working with Large Language Models (LLMs)
• Familiarity with LangChain, LangGraph, or similar AI frameworks
• Experience integrating AI APIs such as OpenAI or Groq
• Understanding of vector databases and embeddings
• Knowledge of prompt engineering techniques
• Experience building REST APIs for AI services
• Strong debugging and analytical skills
• Passion for AI and emerging technologies`,
    },

    {
      title: "Machine Learning Engineer",
      companyName: "Neuron Analytics",
      description: `Neuron Analytics is seeking a Machine Learning Engineer to build, train, and deploy machine learning models for real-world applications. You will work with large datasets, optimize model performance, and collaborate with software engineers to integrate ML solutions into production systems.`,

      requirements: `• Bachelor's degree in Computer Science, Data Science, or related field
• Experience with Python and machine learning libraries
• Knowledge of TensorFlow or PyTorch
• Experience with data preprocessing and feature engineering
• Familiarity with model evaluation techniques
• Experience deploying ML models into production
• Understanding of SQL and data pipelines
• Strong mathematical and analytical skills
• Excellent communication and collaboration abilities`,
    },

    {
      title: "UI/UX Designer",
      companyName: "PixelForge Studio",
      description: `PixelForge Studio is looking for a creative UI/UX Designer to craft intuitive digital experiences across web and mobile applications. You will conduct user research, create wireframes and prototypes, collaborate with developers, and ensure every interface is both visually appealing and highly usable.`,

      requirements: `• 2+ years of UI/UX design experience
• Strong proficiency with Figma
• Experience creating wireframes and interactive prototypes
• Understanding of design systems and accessibility
• Knowledge of responsive web and mobile design
• Ability to conduct user research and usability testing
• Strong visual design and typography skills
• Excellent communication and collaboration skills`,
    },

    {
      title: "QA Engineer",
      companyName: "QualitySoft Solutions",
      description: `QualitySoft Solutions is hiring a QA Engineer to ensure our applications meet the highest quality standards. You will create test plans, perform manual and automated testing, identify defects, and work closely with developers to improve product reliability before every release.`,

      requirements: `• 2+ years of software testing experience
• Experience with manual and automated testing
• Familiarity with Cypress, Playwright, or Selenium
• Strong understanding of software testing methodologies
• Experience testing REST APIs
• Knowledge of bug tracking tools such as Jira
• Strong analytical and documentation skills
• Excellent attention to detail`,
    },

    {
      title: "Database Engineer",
      companyName: "DataCore Systems",
      description: `DataCore Systems is seeking a Database Engineer to design, optimize, and maintain high-performance database systems. You will improve query performance, manage backups, ensure data integrity, and work with engineering teams to support scalable applications handling large volumes of data.`,

      requirements: `• Strong experience with PostgreSQL or MySQL
• Knowledge of database design and normalization
• Experience writing complex SQL queries
• Familiarity with indexing and query optimization
• Understanding of backup and recovery strategies
• Experience monitoring database performance
• Knowledge of database security best practices
• Strong troubleshooting and analytical skills`,
    },

    {
      title: "Product Engineer",
      companyName: "LaunchWorks",
      description: `LaunchWorks is looking for a Product Engineer to build customer-focused features across our SaaS platform. You will collaborate closely with product managers, designers, and engineers to rapidly deliver new functionality while maintaining high code quality and system performance.`,

      requirements: `• 3+ years of Full Stack development experience
• Strong knowledge of React and Node.js
• Experience with PostgreSQL or MongoDB
• Familiarity with REST APIs and authentication
• Experience building scalable SaaS applications
• Strong understanding of Git workflows
• Ability to work independently in an Agile environment
• Excellent communication and problem-solving skills`,
    },

    {
      title: "Mobile Application Developer",
      companyName: "AppWave Technologies",
      description: `AppWave Technologies is hiring a Mobile Application Developer to build modern cross-platform mobile applications. You will work with designers and backend engineers to deliver reliable, high-performance mobile experiences while ensuring excellent usability across Android and iOS devices.`,

      requirements: `• 2+ years of React Native experience
• Experience with Expo and mobile deployment
• Strong understanding of JavaScript or TypeScript
• Experience integrating REST APIs
• Knowledge of state management using Redux or Context API
• Familiarity with mobile performance optimization
• Experience with Git version control
• Strong debugging and communication skills`,
    },

    {
      title: "Cloud Engineer",
      companyName: "SkyNet Cloud Services",
      description: `SkyNet Cloud Services is seeking a Cloud Engineer to build, manage, and optimize cloud infrastructure supporting our enterprise applications. You will work with DevOps and software engineering teams to improve scalability, automate deployments, and maintain secure cloud environments for production workloads.`,

      requirements: `• 3+ years of cloud engineering experience
• Strong knowledge of AWS services including EC2, S3, RDS, IAM, and VPC
• Experience with Docker and Kubernetes
• Familiarity with Infrastructure as Code using Terraform
• Experience implementing CI/CD pipelines
• Knowledge of Linux server administration
• Understanding of networking, security groups, and load balancing
• Experience monitoring cloud infrastructure and troubleshooting production issues
• Strong communication and collaboration skills`,
    },
  ].map((job) => ({
    ...job,
    createdBy: 4,
    status: "PUBLISHED",
    publishedAt: new Date(),
  }));

  await db.insert(jobs).values(data);

  console.log(`✅ ${data.length} jobs inserted successfully.`);

  process.exit(0);
}

seedJobs().catch((err) => {
  console.error(err);
  process.exit(1);
});
