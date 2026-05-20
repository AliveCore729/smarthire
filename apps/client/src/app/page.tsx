import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect anyone visiting the root URL straight to the dashboard.
  // Our AuthProvider and Layout guard will automatically catch them 
  // and bounce them to /login if they aren't signed in!
  redirect("/dashboard");
}