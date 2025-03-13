const BEGINNER_ICON = "carbon:skill-level-basic";
const INTERMEDIATE_ICON = "carbon:skill-level-intermediate";
const ADVANCED_ICON = "carbon:skill-level-advanced";

const LEVEL_ICONS = new Map<string, string>([
  ["Beginner", BEGINNER_ICON],
  ["Intermediate", INTERMEDIATE_ICON],
  ["Advanced", ADVANCED_ICON],
  ["Podstawowy", BEGINNER_ICON],
  ["Średniozaawansowany", INTERMEDIATE_ICON],
  ["Zaawansowany", ADVANCED_ICON],
]);

export function getLevelIcon(level: string): string {
  return LEVEL_ICONS.get(level) ?? BEGINNER_ICON;
}
