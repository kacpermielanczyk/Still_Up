import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { isApiError } from "@/api/errors";
import Button from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import { useAuthContext } from "@/contexts";
import type { LoginFormValues } from "@/types";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login.mutateAsync(data);
      navigate("/");
    } catch (error) {
      setError("email", {
        type: "server",
        message: isApiError(error)
          ? error.message
          : "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center">
        <h1 className="mb-2 text-5xl font-semibold">Log in</h1>
        <p className="font-semibold text-text-muted">
          Welcome back. Sign in to continue monitoring.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Input
          label="Email"
          placeholder="Enter your email"
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
          })}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          {...register("password", {
            required: "Password is required",
          })}
          error={errors.password?.message}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button
          text="Log in"
          icon={KeyRound}
          type="submit"
          loading={login.isPending}
          error={login.isError}
        />

        <Link
          to="/register"
          className="text-center font-semibold opacity-80 transition-all hover:opacity-100"
        >
          Don't have an account yet?{" "}
          <span className="text-primary underline">Sign up</span>
        </Link>
      </div>
    </form>
  );
}
