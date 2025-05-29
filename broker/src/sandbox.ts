import { TAG } from "./const";

const TechnologyRunnerMapping = {
  python: "python",
  vba: "ai",
} as const;

export type Technology = keyof typeof TechnologyRunnerMapping;
type Runner = (typeof TechnologyRunnerMapping)[Technology];
export type SandboxName = `${Runner}-sandbox`;
export type SandboxImage = `loopedupl/${SandboxName}:${string}`;

export function getSandboxName(technology: Technology): SandboxName {
  return `${TechnologyRunnerMapping[technology]}-sandbox`;
}
export function getSandboxImage(technology: Technology): SandboxImage {
  const runnerName = getSandboxName(technology);
  return `loopedupl/${runnerName}:${TAG}`;
}
