import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";
import { FormInput } from "@/src/components/ui/!to-migrate/form-input";
import { Button } from "@/src/components/ui/!to-migrate/button";
import { toast } from "sonner";
import AuthLayout from "@/src/components/AuthLayout";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signup(data);
      toast.success("Account created successfully!");
      navigate("/auth/signin");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          error.message === "Failed to create user"
            ? "Username Already Taken"
            : error.message
        );
      }
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-md shadow-sm space-y-4">
          <FormInput
            id="name"
            type="text"
            label="Full name"
            autoComplete="name"
            required
            {...register("name")}
            error={errors.name?.message}
          />
          <FormInput
            id="username"
            type="text"
            label="Username"
            autoComplete="username"
            required
            {...register("username")}
            error={errors.username?.message}
          />
          <FormInput
            id="email"
            type="email"
            label="Email address"
            autoComplete="email"
            required
            {...register("email")}
            error={errors.email?.message}
          />
          <FormInput
            id="password"
            type="password"
            label="Password"
            autoComplete="new-password"
            required
            {...register("password")}
            error={errors.password?.message}
          />
          <FormInput
            id="confirmPassword"
            type="password"
            label="Confirm password"
            autoComplete="new-password"
            required
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/auth/signin" className="text-pink-500 hover:text-pink-600">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
