import { redirect } from "next/navigation";

type EmergencyRedirectProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EmergencyRedirect({
  searchParams,
}: EmergencyRedirectProps) {
  const params = searchParams ? await searchParams : {};
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => query.append(key, entry));
    } else if (value) {
      query.set(key, value);
    }
  });

  const suffix = query.toString();
  redirect(`/register/emergency-bracelet${suffix ? `?${suffix}` : ""}`);
}
