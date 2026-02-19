export type Theme = "light" | "dark";

export type WorkExperience = {
  role: string;
  department?: string;
  company: string;
  period: string;
  summary: string;
};

export type School = {
  name: string;
  period: string;
  degree1: string;
  degree2?: string;
  minor?: string;
};

export type Project = {
  title: string;
  description: string;
  link?: string;
};

export type Skill = {
  name: string;
  logo: string;
};
