import { redirect } from "next/navigation";

export const metadata = { title: "მპოვნელის ჩათი | KOMPASI" };

export default function Chat() {
  redirect("/account/chat?source=app");
}
