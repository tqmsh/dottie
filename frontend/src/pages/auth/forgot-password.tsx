import React from "react";
import { Link } from "react-router-dom";
import PasswordResetRequestForm from "../../pages/user/PasswordResetRequestForm";
import AuthLayout from "../../components/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground">
          No worries, we'll send you reset instructions.
        </p>
      </div>
      
      <div className="mt-8">
        <PasswordResetRequestForm />
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Remembered your password?{" "}
          <Link to="/auth/sign-in" className="text-pink-500 hover:text-pink-600">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
} 