"use client";

import AuthShell from "../components/auth/AuthShell";
import AccountSignupForm from "../components/auth/AccountSignupForm";

export default function SignupPage() {
  return (
    <AuthShell
      title="შექმენით თქვენი ანგარიში"
      subtitle="ანგარიშის შექმნის შემდეგ შეძლებთ აირჩიოთ პროდუქტის ტიპი და მართოთ შეუზღუდავი QR პროფილები ერთი სივრციდან."
    >
      <AccountSignupForm />
    </AuthShell>
  );
}
