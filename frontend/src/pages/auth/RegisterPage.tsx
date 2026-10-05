import RegisterForm from "../../components/forms/auth/RegisterForm";
import AuthLayout from "../../layouts/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout
      info={{
        title: "Your own lightweight uptime monitor.",
        subtitle:
          "Create an account, add your services and keep track of uptime, latency and failures.",
        activeCard: 1,
        cards: [
          { text: "Add websites, APIs and local services" },
          { text: "Track uptime and response times" },
          { text: "Review failures and recent checks" },
        ],
      }}
    >
      <RegisterForm />
    </AuthLayout>
  );
}
