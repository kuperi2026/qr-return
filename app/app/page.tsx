import { redirect } from "next/navigation";

export default function AppHome() {
  redirect("/login?source=app&next=%2Fapp%2Fproducts");
}
