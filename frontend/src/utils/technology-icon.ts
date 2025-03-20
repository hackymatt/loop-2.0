import { isIconExists } from "src/components/iconify";

function cleanseTechnologyName(technology: string) {
  return technology.toLowerCase().replace(/\+/g, "plus").replace(/#/g, "sharp").replace(/\./g, "");
}

export function getTechnologyIcon(technology: string): string {
  const technologyName = cleanseTechnologyName(technology);
  const defaultIcon = isIconExists(`logos:${technologyName}-icon`)
    ? `logos:${technologyName}-icon`
    : `logos:${technologyName}`;
  return isIconExists(defaultIcon) ? defaultIcon : "carbon:code";
}
