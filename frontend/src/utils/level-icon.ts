const BEGINNER_ICON = "carbon:skill-level-basic";
const INTERMEDIATE_ICON = "carbon:skill-level-intermediate";
const ADVANCED_ICON = "carbon:skill-level-advanced";

const LEVEL_ICONS = new Map<string, string>([
  ["beginner", BEGINNER_ICON],
  ["intermediate", INTERMEDIATE_ICON],
  ["advanced", ADVANCED_ICON],
]);

export function getLevelIcon(level: string): string {
  return LEVEL_ICONS.get(level) ?? BEGINNER_ICON;
}
