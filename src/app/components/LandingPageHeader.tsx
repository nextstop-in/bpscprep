import { useNavigate } from "react-router";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

export function LandingPageHeader() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
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
          <Button
            onClick={handleLoginRedirect}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Login / Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}
