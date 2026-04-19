import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";

import { authApi } from "../api/auth";
import { useAuth } from "../contexts/useAuth";
import { registerSchema, type RegisterFormData } from "../lib/validation";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isPendingNav, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      if (response.data) {
        login(response.data.token, response.data.user);
        startTransition(() => {
          navigate("/dashboard", { replace: true });
        });
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Registration failed. Please try again.";
      setError("root.serverError", { type: "server", message });
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { ...payload } = data;
    await mutation.mutateAsync(payload);
  };

  const isLoading = isSubmitting || mutation.isPending || isPendingNav;
  const serverError = errors.root?.serverError?.message;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-blue-600" aria-hidden />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="text-gray-600 mt-2">
              Start tracking your finances today
            </p>
          </div>

          {serverError && (
            <div className="mb-6">
              <Alert type="error" message={serverError} />
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <Input
              label="Name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={!isValid && !isSubmitting}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
