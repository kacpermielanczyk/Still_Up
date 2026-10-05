import { UserRoundPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { isApiError } from "@/api/errors";
import Button from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import { useAuthContext } from "@/contexts";
import type { RegisterRequest } from "@/types";

type RegisterFormData = RegisterRequest & {
  confirmPassword: string;
};

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthContext();

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    const payload: RegisterRequest = {
      email: data.email,
      password: data.password,
    };

    try {
      await registerUser.mutateAsync(payload);
      navigate("/login");
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
        <h1 className="mb-2 text-5xl font-semibold">Join us</h1>
        <p className="font-semibold text-text-muted">
          Create an account and start monitoring your services.
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
          placeholder="Create a password"
          autoComplete="new-password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          error={errors.password?.message}
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button
          text="Register"
          icon={UserRoundPlus}
          type="submit"
          loading={registerUser.isPending}
          error={registerUser.isError}
        />

        <Link
          to="/login"
          className="text-center font-semibold opacity-80 transition-all hover:opacity-100"
        >
          Already have an account?{" "}
          <span className="text-primary underline">Log in</span>
        </Link>
      </div>
    </form>
  );
}
