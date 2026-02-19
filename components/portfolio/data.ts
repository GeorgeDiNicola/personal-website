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
      "Spearheaded design and development of a financial tech web application using Java Spring Boot and JavaScript React, delivering MVP in 2 months."
  },
  {
    role: "Database Engineer II",
    department: "Business Intelligence Services",
    company: "Comcast Business",
    period: "2019 - 2021",
    summary:
      "Optimized data infrastructure and reliability, delivering automated systems that significantly reduced operational overhead and infrastructure costs. Built robust ingestion pipelines and custom internal tools to streamline cross-team development workflows."
  },
  {
    role: "Business Intelligence Analyst II",
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
    minor: "Software Systems Concentration"
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
    title: "Automated Jeopardy! Insights Dashboard & Predictive Machine Learning Model",
    description:
      "Designed and built a Jeopardy! data system that automates ETL processes for a live Tableau dashboard and implements a self-developed machine learning model to forecast game outcomes for reigning champions."
  },
  {
    title: "Macroeconomic Data Pipeline - World Bank Dataset",
    description:
      "World Bank dataset generation via a custom software application that discovers and groups high-quality indicators with rules-based logic & artificial intelligence, generates metadata, and performs ETL for macroeconomic data from the World Bank API. Currently has 12k+ views and 2.5k+ downloads.",
    link: "https://www.kaggle.com/datasets/georgejdinicola/world-bank-indicators"
  },
  {
    title: "Blockchain-based Middleware for Relational Database Management Systems",
    description:
      "Built a middleware application design presented in research studies for internally tamper-proofing centralized and decentralized relational database management systems for Topics in Software Engineering final project at Columbia Univeristy.",
    link: "https://github.com/GeorgeDiNicola/TDRB-Middleware-Extension"
  },
  {
    title: "Pokemon Rankings Dashboard",
    description:
      "An interactive Tableau Public dashboard that provides analysis of Pokemon statistics, allowing users to rank and compare Pokemon from different generations across all core battle dimensions",
    link: "https://public.tableau.com/app/profile/george.dinicola/viz/pokemon_analysis/PokemonRankings"
  }
];

export const skills: Skill[] = [
  { name: "Go", logo: "https://cdn.simpleicons.org/go" },
  { name: "Python", logo: "https://cdn.simpleicons.org/python" },
  { name: "Flask", logo: "https://cdn.simpleicons.org/flask" },
  { name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript" },
  { name: "React", logo: "https://cdn.simpleicons.org/react" },
  { name: "Docker", logo: "https://cdn.simpleicons.org/docker" },
  { name: "Linux", logo: "https://cdn.simpleicons.org/linux" },
  { name: "SQL", logo: "https://cdn.simpleicons.org/sqlite" },
  { name: "PostgreSQL", logo: "https://cdn.simpleicons.org/postgresql" },
  { name: "Git", logo: "https://cdn.simpleicons.org/git" },
  { name: "AWS", logo: "/aws.svg" },
  { name: "Jenkins", logo: "https://cdn.simpleicons.org/jenkins" },
  { name: "HashiCorp Vault", logo: "https://cdn.simpleicons.org/vault" },
  { name: "Tableau", logo: "/tableau.png" }
];
