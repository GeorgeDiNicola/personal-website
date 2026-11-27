import type { Project, School, Skill, WorkExperience } from "./types";

export const githubUsername = "GeorgeDiNicola";

export const workHistory: WorkExperience[] = [
  {
    role: "Software Development Engineer II",
    department: "Trust Intelligence Platform",
    company: "Remitly",
    period: "2026 - Present",
    summary:
      "Contributing to the Trust Intelligence Platform to support secure and reliable financial services."
  },
  {
    role: "Software Engineer II",
    department: "Core Platform & Infrastructure",
    company: "Qualtrics",
    period: "2022 - 2024",
    summary:
      "Developed & scaled core infrastructure and identity systems while maintaining Tier-0 system availability."
  },
  {
    role: "Full-Stack Software Engineer",
    department: "Product & Infrastructure",
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
      "Cut infrastructure costs through automation and developed ingestion pipelines and internal tools that streamlined cross-team development."
  },
  {
    role: "Business Intelligence Analyst II",
    department: "Business Intelligence Platform",
    company: "Newrez",
    period: "2018 - 2019",
    summary:
      "Led the development of machine learning models that improved forecast accuracy. Built stored procedures and interactive dashboards to modernize data operations."
  },
  {
    role: "Research Assistant Co-op",
    company: "Drexel University",
    period: "2015 - 2016"
  },
  {
    role: "Private Wealth Management Co-op",
    company: "Goldman Sachs",
    period: "2014 - 2015"
  },
  {
    role: "State & Local Tax Co-op",
    company: "Comcast",
    period: "2013 - 2014"
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
    title: "Through the Looking-Glass Chess Interactive",
    description:
      "I created an illustrated chessboard that lets readers follow Alice from pawn to queen, moving through Lewis Carroll’s story one move at a time.",
    accent: "var(--accent)",
    featured: true,
    link: "/projects/through-the-looking-glass/",
    tags: ["Interactive Storytelling", "Chess"]
  },
  {
    title: "Automated Jeopardy! Insights Dashboard & Predictive Machine Learning Model",
    description:
      "I built an automated data pipeline for a live Tableau dashboard and a machine learning model that predicts whether the reigning Jeopardy! champion will win their next game.",
    accent: "var(--accent)",
    featured: true,
    link: "/projects/jeopardy/",
    tags: ["AI/ML Forecasting", "Data Engineering"]
  },
  {
    title: "Macroeconomic Data Pipeline - World Bank Dataset",
    description:
      "I built a pipeline that processes macroeconomic data from the World Bank API, uses rules and AI to select and group indicators, and generates metadata. The dataset has received 15k+ views and 3k+ downloads on Kaggle.com.",
    accent: "var(--accent-three)",
    featured: true,
    link: "https://www.kaggle.com/datasets/georgejdinicola/world-bank-indicators",
    tags: ["Data Engineering", "AI/NLP", "Kaggle"]
  },
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
    title: "DIY Radio Antenna",
    description:
      "I built a radio antenna from wood, bronze, coaxial cable, and solder, and use software-defined radio (SDR) to receive and explore amateur radio signals on my computer.",
    accent: "var(--accent)",
    featured: true,
    link: "/projects/radio-antenna/",
    tags: ["Software-Defined Radio", "Antenna Hardware", "Soldering"]
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
    title: "Data Visualizations",
    description:
      "I created public dashboards using Tableau and Flourish to explore data, compare rankings, and visualize trends through interactive analytics.",
    accent: "var(--accent)",
    link: "/data-visualizations/",
    tags: ["Analytics / Data Visualization"]
  }
];

export const skills: Skill[] = [
  { name: "Claude Code", logo: "https://cdn.simpleicons.org/claudecode" },
  { name: "Codex", logo: "https://devicons.io/devicons/icons/codex-icon.svg" },
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
  { name: "Prometheus", logo: "https://cdn.simpleicons.org/prometheus" },
  { name: "Grafana", logo: "https://cdn.simpleicons.org/grafana" },
  { name: "GitHub Actions", logo: "https://cdn.simpleicons.org/githubactions" },
  { name: "AWS", logo: "/aws.svg" },
  { name: "Tableau", logo: "/tableau.png" },
  { name: "Arduino", logo: "https://cdn.simpleicons.org/arduino" },
  { name: "Raspberry Pi", logo: "https://cdn.simpleicons.org/raspberrypi" }
];
