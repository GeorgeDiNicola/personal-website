import type { Project, School, Skill, WorkExperience } from "./types";

export const githubUsername = "GeorgeDiNicola";

export const workHistory: WorkExperience[] = [
  {
    role: "Software Engineer II",
    department: "Core Platform & Infrastructure",
    company: "Qualtrics",
    period: "2022 - 2024",
    summary:
      "Developed & scaled core infrastructure and identity systems, while maintaining Tier-0 system availability."
  },
  {
    role: "Full-Stack Software Engineer",
    department: "Product",
    company: "Columbia Build Lab Fellowship",
    period: "2021 - 2021",
    summary:
      "Spearheaded design and development of a financial tech web application using Java Spring Boot and JavaScript React, delivering an MVP in two months."
  },
  {
    role: "Database Engineer II",
    department: "Business Intelligence Platform",
    company: "Comcast Business",
    period: "2019 - 2021",
    summary:
      "Optimized data infrastructure and reliability, delivering automated systems that significantly reduced operational overhead and infrastructure costs. Built robust ingestion pipelines and custom internal tools to streamline cross-team development workflows."
  },
  {
    role: "Business Intelligence Analyst II",
    department: "Business Intelligence Platform",
    company: "Newrez",
    period: "2018 - 2019",
    summary:
      "Led the end-to-end modernization of data operations by developing database stored procedures, designing interactive dashboards, and engineering predictive machine learning models that significantly improved forecast accuracy."
  }
];

export const schools: School[] = [
  {
    name: "Columbia University",
    period: "2021 - 2022",
    degree1: "MS Computer Science",
    concentration: "Software Systems"
  },
  {
    name: "Drexel University, Pennoni Honors College",
    period: "2012 - 2017",
    degree1: "BA Mathematics",
    degree2: "BS Economics",
    minor: "Business Administration"
  }
];

export const projects: Project[] = [
  {
    title: "Adaptive TV Audio Controller",
    description:
      "I built an Arduino Uno controller that monitors relative signal variation from a sound sensor and automatically lowers TV volume during sustained loudness or sudden spikes using rolling-window analysis and infrared remote commands.",
    accent: "var(--accent)",
    featured: true,
    link: "https://github.com/GeorgeDiNicola/adaptive-tv-audio-controller",
    tags: ["Arduino / C++", "Embedded Systems", "Signal Processing"]
  },
  {
    title: "Automated Jeopardy! Insights Dashboard & Predictive Machine Learning Model",
    description:
      "I designed and built a Jeopardy! data system that automates ETL processes for a live Tableau dashboard and implements a self-developed machine learning model to forecast game outcomes for reigning champions.",
    accent: "var(--accent)",
    featured: true,
    link: "/projects/jeopardy/",
    tags: ["AI/ML Forecasting", "Data Engineering"]
  },
  {
    title: "DIY Radio Antenna",
    description:
      "I built a radio antenna from wood, bronze, coaxial cable, and solder, and use software-defined radio (SDR) to receive and explore amateur radio signals on my computer.",
    accent: "var(--accent)",
    featured: true,
    link: "/projects/radio-antenna/",
    tags: ["Software-Defined Radio", "Antenna Hardware", "Soldering"]
  },
  {
    title: "Macroeconomic Data Pipeline - World Bank Dataset",
    description:
      "I built a pipeline that discovers and groups high-quality indicators using rules-based logic and artificial intelligence, generates metadata, and performs ETL for macroeconomic data from the World Bank API. The dataset has 13k+ views and 2.5k+ downloads.",
    accent: "var(--accent-three)",
    featured: true,
    link: "https://www.kaggle.com/datasets/georgejdinicola/world-bank-indicators",
    tags: ["Data Engineering", "AI/NLP", "Kaggle"]
  },
  {
    title: "Blockchain-based Middleware for Relational Database Management Systems",
    description:
      "I implemented blockchain-based middleware for relational databases as my final project for Topics in Software Engineering at Columbia University.",
    accent: "var(--accent)",
    link: "https://github.com/GeorgeDiNicola/TDRB-Middleware-Extension",
    tags: ["Infrastructure", "Databases", "Research"]
  },
  {
    title: "Tableau Public Dashboards",
    description:
      "I create public dashboards using Tableau and Flourish to explore data, compare rankings, and visualize trends through interactive analytics.",
    accent: "var(--accent)",
    link: "/data-visualizations/",
    tags: ["Analytics", "Tableau", "Flourish"]
  }
];

export const skills: Skill[] = [
  { name: "Go", logo: "https://cdn.simpleicons.org/go" },
  { name: "Python", logo: "https://cdn.simpleicons.org/python" },
  { name: "pytest", logo: "https://cdn.simpleicons.org/pytest" },
  { name: "Pandas", logo: "https://cdn.simpleicons.org/pandas" },
  { name: "Apache Spark", logo: "https://cdn.simpleicons.org/apachespark" },
  { name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript" },
  { name: "React", logo: "https://cdn.simpleicons.org/react" },
  { name: "Docker", logo: "https://cdn.simpleicons.org/docker" },
  { name: "Linux", logo: "https://cdn.simpleicons.org/linux" },
  { name: "SQL", logo: "https://cdn.simpleicons.org/sqlite" },
  { name: "PostgreSQL", logo: "https://cdn.simpleicons.org/postgresql" },
  { name: "Git", logo: "https://cdn.simpleicons.org/git" },
  { name: "Terraform", logo: "https://cdn.simpleicons.org/terraform" },
  { name: "Prometheus", logo: "https://cdn.simpleicons.org/prometheus" },
  { name: "Grafana", logo: "https://cdn.simpleicons.org/grafana" },
  { name: "GitHub Actions", logo: "https://cdn.simpleicons.org/githubactions" },
  { name: "AWS", logo: "/aws.svg" },
  { name: "Tableau", logo: "/tableau.png" },
  { name: "Arduino", logo: "https://cdn.simpleicons.org/arduino" },
  { name: "Raspberry Pi", logo: "https://cdn.simpleicons.org/raspberrypi" }
];
