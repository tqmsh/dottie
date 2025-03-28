import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AuthLayout from "@/src/components/AuthLayout";

export default function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      await login(data);
      toast.success("Successfully signed in!");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-md shadow-sm space-y-4">
          <FormInput
            id="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            autoComplete="email"
            required
            {...register("email")}
            error={errors.email?.message}
          />
          <FormInput
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            {...register("password")}
            error={errors.password?.message}
          />
        </div>
        <div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/auth/signup" className="text-pink-500 hover:text-pink-600">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
