import { BookOpen } from "lucide-react";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div className={`p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg ${className}`}>
      <BookOpen className="h-full w-full text-white" />
    </div>
  );
}
