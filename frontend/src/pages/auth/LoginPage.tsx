import LoginForm from "../../components/forms/auth/LoginForm";
import AuthLayout from "../../layouts/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout
      info={{
        title: "See how your services are doing.",
        subtitle:
          "Sign in to review current status, recent failures and performance across your monitored endpoints.",
        activeCard: 2,
        cards: [
          { text: "Check service health at a glance" },
          { text: "Inspect uptime and latency trends" },
          { text: "Find recent errors and failed checks" },
        ],
      }}
    >
      <LoginForm />
    </AuthLayout>
  );
}
