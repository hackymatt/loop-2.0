import { isIconExists } from "src/components/iconify";

export function getTechnologyIcon(technology: string): string {
  const defaultIcon = isIconExists(`logos:${technology.toLowerCase()}-icon`)
    ? `logos:${technology.toLowerCase()}-icon`
    : `logos:${technology.toLowerCase()}`;
  return isIconExists(defaultIcon) ? defaultIcon : "carbon:code";
}
