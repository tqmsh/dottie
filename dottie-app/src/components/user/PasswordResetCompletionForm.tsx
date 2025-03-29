import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi, PasswordResetCompletionSchema } from "../../api/auth";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { useRouter } from "next/router";

// Get type from the schema
type PasswordResetCompletionFormInputs = Omit<z.infer<typeof PasswordResetCompletionSchema>, "token">;

interface PasswordResetCompletionFormProps {
  token: string;
}

export const PasswordResetCompletionForm: React.FC<PasswordResetCompletionFormProps> = ({ token }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PasswordResetCompletionFormInputs>({
    resolver: zodResolver(
      PasswordResetCompletionSchema.omit({ token: true })
    ),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit: SubmitHandler<PasswordResetCompletionFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      // Combine form data with token
      const resetData = {
        ...data,
        token,
      };
      
      const result = await authApi.completePasswordReset(resetData);
      setIsResetComplete(true);
      toast({
        title: "Success",
        description: "Your password has been reset successfully.",
        variant: "default",
      });
      reset();
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isResetComplete) {
    return (
      <Card className="max-w-md w-full mx-auto">
        <CardHeader>
          <CardTitle>Password Reset Complete</CardTitle>
          <CardDescription>
            Your password has been reset successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You will be redirected to the login page in a moment. Please log in with your new password.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={() => router.push("/auth/login")}
          >
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full mx-auto">
      <CardHeader>
        <CardTitle>Create New Password</CardTitle>
        <CardDescription>
          Enter a new password for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmNewPassword")}
            />
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordResetCompletionForm; 