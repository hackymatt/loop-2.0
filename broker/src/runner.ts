const RUNNER = {
  python: "python-runner:latest",
} as const;

export type Runner = (typeof RUNNER)[keyof typeof RUNNER];
export type RunnerName = `${keyof typeof RUNNER}-runner`;
export type Technology = keyof typeof RUNNER;

export function getRunnerName(technology: Technology): RunnerName {
  return `${technology}-runner`;
}
export function getRunnerImage(technology: Technology): Runner {
  return RUNNER[technology];
}
