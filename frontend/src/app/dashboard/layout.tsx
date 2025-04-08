import { AccountLayout } from "src/layouts/account";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <AccountLayout>{children}</AccountLayout>;
}
