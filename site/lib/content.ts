import roadmapData from "../data/roadmap.json";
import changelogData from "../data/changelog.json";

export type Status = "shipped" | "in-progress" | "planned";
export type StageColor = "pink" | "teal" | "lavender" | "peach" | "ochre";

export interface Feature {
  id: string;
  title: string;
  blurb: string;
  status: Status;
}

export interface Stage {
  id: string;
  stage: number;
  name: string;
  version: string;
  status: Status;
  color: StageColor;
  tagline: string;
  summary: string;
  features: Feature[];
}

export interface ChangelogEntry {
  date: string;
  title: string;
  body: string;
}

export const stages = roadmapData.stages as Stage[];
export const currentFocus = stages.find(
  s => s.id === roadmapData.currentFocus,
)!;
export const changelog = changelogData as ChangelogEntry[];

export function getStage(id: string): Stage {
  const stage = stages.find(s => s.id === id);
  if (!stage) throw new Error(`Unknown stage: ${id}`);
  return stage;
}

export const statusLabel: Record<Status, string> = {
  shipped: "Available now",
  "in-progress": "In development",
  planned: "Coming soon",
};

export const GITHUB_URL = "https://github.com/gafaraleshe/hermite";
