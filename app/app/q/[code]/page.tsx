import { redirect } from "next/navigation";

type PageProps = { params: { code: string } };

export default function LegacyQRPage({ params }: PageProps) {
  redirect(`/scan/${encodeURIComponent(params.code.trim())}`);
}
