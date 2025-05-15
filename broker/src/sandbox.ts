import { TAG } from "./const";

export type Technology = "python";
export type SandboxName = `${Technology}-sandbox`;
export type SandboxImage = `loopedupl/${SandboxName}:${string}`;

export function getSandboxName(technology: Technology): SandboxName {
  return `${technology}-sandbox`;
}
export function getSandboxImage(technology: Technology): SandboxImage {
  const runnerName = getSandboxName(technology);
  return `loopedupl/${runnerName}:${TAG}`;
}
