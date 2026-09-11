import { redirect } from "next/navigation";

export default function Chat() {
  redirect("/account/chat?source=app");
}
