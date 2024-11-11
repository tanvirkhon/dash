import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | AI TradeBot",
  description: "Login to your AI TradeBot account",
};

export default function LoginPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-[350px] mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}