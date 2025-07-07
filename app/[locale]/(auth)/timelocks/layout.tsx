import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: Pick<Props, "params">) {
  const t = await getTranslations({ locale, namespace: "Timelocks" });

  return {
    title: t("title"),
  };
}

export default function TimelocksLayout({ children }: Props) {
  return <>{children}</>;
}
