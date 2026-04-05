import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { ToppersList } from "./ToppersList";
import { ImportantTopics } from "./ImportantTopics";
import { Logo } from "./Logo";
import { LogOut } from "lucide-react";
import { useEffect } from "react";

export function Layout() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                if (location.pathname.includes("/test/")) {
                  const shouldLeave = window.confirm(
                    "Your test progress will be lost if you leave. Are you sure you want to go home?"
                  );
                  if (!shouldLeave) return;
                }
                navigate("/home");
              }}
              role="button"
              tabIndex={0}
            >
              <Logo className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-foreground">bpscprep.in</h1>
                <p className="text-xs text-slate-500">Your BPSC Success Partner</p>
              </div>
            </div>

            <nav className="flex items-center gap-4">
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Logged in as</p>
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <Button
                  variant="default"
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            <Outlet />
          </div>

          {/* Right Sidebar - Hidden on test and result pages */}
          {!location.pathname.includes("/test/") && !location.pathname.includes("/result/") && (
            <div className="w-80 space-y-6">
              <ToppersList />
              <ImportantTopics />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}