import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi, PasswordResetRequestSchema } from "../../api/auth";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";

// Get type from the schema
type PasswordResetRequestFormInputs = z.infer<typeof PasswordResetRequestSchema>;

export const PasswordResetRequestForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PasswordResetRequestFormInputs>({
    resolver: zodResolver(PasswordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<PasswordResetRequestFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const result = await authApi.requestPasswordReset(data);
      setIsEmailSent(true);
      toast({
        title: "Success",
        description: "Password reset email sent. Please check your inbox.",
        variant: "default",
      });
      reset();
    } catch (error) {
      console.error("Password reset request error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to request password reset",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <Card className="max-w-md w-full mx-auto">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If you don't see the email, please check your spam folder or request another reset email.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setIsEmailSent(false)}
          >
            Request Another Reset Email
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full mx-auto">
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordResetRequestForm; 