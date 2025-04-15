import type { Metadata } from "next";

import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { LANGUAGE } from "src/consts/language";
import { certificateQuery } from "src/api/certificate/certificate";

import { CertificateView } from "src/sections/view/certificate-view";

// ----------------------------------------------------------------------
export default function Page({ params }: { params: { id: string } }) {
  return <CertificateView id={params.id} />;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { queryFn } = certificateQuery(params.id, LANGUAGE.PL);

    const { results: certificate } = await queryFn();

    const title = `Certyfikat dla ${certificate.studentName} za ukończenie ${certificate.courseName}`;

    return createMetadata({ title, path: `${paths.certificate}/${params.id}` });
  } catch {
    return createMetadata({
      title: "Nie znaleziono certyfikatu",
    });
  }
}
