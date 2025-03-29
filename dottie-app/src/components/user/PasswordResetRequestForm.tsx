import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";

// Define schema directly here for simplicity
const PasswordResetRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type PasswordResetRequestFormInputs = z.infer<typeof PasswordResetRequestSchema>;

export const PasswordResetRequestForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<PasswordResetRequestFormInputs>({
    resolver: zodResolver(PasswordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const watchEmail = watch("email", "");

  const onSubmit: SubmitHandler<PasswordResetRequestFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      // Mock API call
      console.log("Requesting password reset for:", data.email);
      
      // Simulate API success
      setIsRequestSubmitted(true);
      reset();
    } catch (error) {
      console.error("Password reset request error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isRequestSubmitted) {
    return (
      <Card className="max-w-md w-full mx-auto">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent reset instructions to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            We've sent instructions to reset your password to <span className="font-semibold">{watchEmail}</span>. 
            Please check your inbox and follow the link provided.
          </p>
          <p className="text-sm text-muted-foreground">
            Didn't receive an email? Check your spam folder or try again.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full"
            variant="outline"
            onClick={() => setIsRequestSubmitted(false)}
          >
            Try Another Email
          </Button>
          <Button 
            className="w-full"
            onClick={() => navigate("/auth/login")}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full mx-auto">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email to receive reset instructions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Instructions"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          variant="link" 
          className="w-full"
          onClick={() => navigate("/auth/login")}
        >
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PasswordResetRequestForm; 