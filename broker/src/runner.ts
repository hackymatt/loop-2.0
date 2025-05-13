import { TAG } from "./const";

export type Technology = "python";
export type RunnerName = `${Technology}-runner`;
export type RunnerImage = `loopedupl/${RunnerName}:${string}`;

export function getRunnerName(technology: Technology): RunnerName {
  return `${technology}-runner`;
}
export function getRunnerImage(technology: Technology): RunnerImage {
  const runnerName = getRunnerName(technology);
  return `loopedupl/${runnerName}:${TAG}`;
}
