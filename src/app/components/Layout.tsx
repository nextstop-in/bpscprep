import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { ToppersList } from "./ToppersList";
import { ImportantTopics } from "./ImportantTopics";
import { Logo } from "./Logo";
import { LogOut, Home, FileText } from "lucide-react";
import { useEffect } from "react";

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
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
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  bpscprep.in
                </h1>
                <p className="text-xs text-gray-500">Your BPSC Success Partner</p>
              </div>
            </div>
            
            <nav className="flex items-center gap-4">
              <Button
                variant={location.pathname === "/dashboard" ? "default" : "ghost"}
                onClick={() => navigate("/dashboard")}
                className={location.pathname === "/dashboard" 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2" 
                  : "flex items-center gap-2"}
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
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

          {/* Right Sidebar - Hidden on mock test pages */}
          {!location.pathname.includes("/mock-test/") && (
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