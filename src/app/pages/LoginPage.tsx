import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Logo } from "../components/Logo";

export function LoginPage() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupOTP, setSignupOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupStep, setSignupStep] = useState<"credentials" | "otp">("credentials");
  const [signupEmail_pending, setSignupEmail_pending] = useState("");

  const { login, signup, confirmSignup, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await signup(signupEmail, signupPassword);
      // OTP sent successfully, move to OTP verification step
      setSignupEmail_pending(signupEmail);
      setSignupStep("otp");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await confirmSignup(signupEmail_pending, signupOTP);
      // OTP confirmed, clear form and redirect
      setSignupStep("credentials");
      setSignupEmail("");
      setSignupPassword("");
      setSignupOTP("");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignup = () => {
    setSignupStep("credentials");
    setSignupOTP("");
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
          <p className="text-gray-500 text-sm">Prepare for your BPSC examination with confidence</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              {signupStep === "credentials" ? (
                <>
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>Sign up to start your BPSC preparation journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Password must contain at least one uppercase letter, one number, and one special character</p>
                      </div>
                      {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                          {error}
                        </div>
                      )}
                      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={isLoading}>
                        {isLoading ? "Sending OTP..." : "Continue"}
                      </Button>
                    </form>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle>Verify Email</CardTitle>
                    <CardDescription>Enter the OTP sent to {signupEmail_pending}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleOTPSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-otp">OTP Code</Label>
                        <Input
                          id="signup-otp"
                          type="text"
                          placeholder="123456"
                          value={signupOTP}
                          onChange={(e) => setSignupOTP(e.target.value)}
                          maxLength={6}
                          required
                        />
                      </div>
                      {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                          {error}
                        </div>
                      )}
                      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify OTP"}
                      </Button>
                      <Button type="button" variant="outline" className="w-full" onClick={handleBackToSignup} disabled={isLoading}>
                        Back
                      </Button>
                    </form>
                  </CardContent>
                </>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}