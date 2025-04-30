import { useParams } from "next/navigation";

export function useLocalizedPath() {
  const { locale } = useParams() as { locale: string };
  return (path: string) => `/${locale}${path}`;
}
