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

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { user, refreshUser } = useAuth();
  const loginMutation = useMutation(
    async ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    {
      onSuccess: (data) => {
        // Store tokens in sessionStorage
        sessionStorage.setItem("accessToken", data.data.accessToken);
        sessionStorage.setItem("idToken", data.data.idToken);
        sessionStorage.setItem("refreshToken", data.data.refreshToken);

        // Create user object
        const userData = {
          id: email,
          name: email.split("@")[0],
          email,
        };

        localStorage.setItem("bpsc_user", JSON.stringify(userData));
      },
    }
  );
  const navigate = useNavigate();

  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (user && shouldRedirect) {
      navigate("/home");
      setShouldRedirect(false);
    }
  }, [user, shouldRedirect, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync({ email, password });
      refreshUser(); // Update AuthContext user state
      setShouldRedirect(true);
    } catch (err: any) {
      setError(err?.message || "Invalid credentials");
    }
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

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={loginMutation.loading}>
                {loginMutation.loading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}