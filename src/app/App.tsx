import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              <RouterProvider router={router} />
            </main>
            <footer className="border-t border-slate-800 bg-slate-950 text-slate-300 py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm">© {new Date().getFullYear()} bpscprep.in — Trusted BPSC preparation content.</p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  <span>Privacy</span>
                  <span>Terms</span>
                  <span>Support</span>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
