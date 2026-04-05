import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "../hooks/useApi";
import * as authService from "../lib/authService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Logo } from "../components/Logo";
import { ArrowLeft } from "lucide-react";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  const { user, refreshUser } = useAuth();
  const signupMutation = useMutation(
    async ({ email, password }: { email: string; password: string }) =>
      authService.sendSignupOTP(email, password)
  );
  const confirmOTPMutation = useMutation(
    async ({ email, code }: { email: string; code: string }) =>
      authService.confirmOTP(email, code),
    {
      onSuccess: (data, variables) => {
        // Create user object after successful OTP confirmation
        const userData = {
          id: variables.email,
          name: variables.email.split("@")[0],
          email: variables.email,
        };

        localStorage.setItem("bpsc_user", JSON.stringify(userData));
      },
    }
  );
  const navigate = useNavigate();

  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (user && shouldRedirect) {
      navigate("/dashboard");
      setShouldRedirect(false);
    }
  }, [user, shouldRedirect, navigate]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signupMutation.mutateAsync({ email, password });
      // OTP sent successfully, move to OTP verification step
      setStep("otp");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await confirmOTPMutation.mutateAsync({ email, code: otp });
      refreshUser(); // Update AuthContext user state
      setShouldRedirect(true);
    } catch (err: any) {
      setError(err?.message || "OTP verification failed");
    }
  };

  const handleBackToCredentials = () => {
    setStep("credentials");
    setOtp("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo className="h-20 w-20" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            bpscprep.in
          </h1>
          <p className="text-gray-600 text-lg font-medium mb-1">Your BPSC Success Partner</p>
          <p className="text-gray-500 text-sm">Create your account to start your BPSC preparation journey</p>
        </div>

        <Card>
          {step === "credentials" ? (
            <>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Sign up to start your BPSC preparation journey</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={signupMutation.loading}>
                    {signupMutation.loading ? "Creating account..." : "Continue"}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Verify Email</CardTitle>
                <CardDescription>Enter the OTP sent to {email}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOTPSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={confirmOTPMutation.loading}>
                    {confirmOTPMutation.loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={handleBackToCredentials} disabled={confirmOTPMutation.loading}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}