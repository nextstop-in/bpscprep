import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, FileText, BookOpen, Calendar } from "lucide-react";
import type { MockTest } from "../data/mockData";

interface MockTestCardProps {
  test: MockTest;
  onStartTest: () => void;
}

export function MockTestCard({ test, onStartTest }: MockTestCardProps) {
  console.log("Rendering MockTestCard for test:", test);
  return (
    <Card className="hover:shadow-lg transition-all border hover:border-purple-300 flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
            {test.subject}
          </Badge>
          {test.year && (
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              {test.year}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{test.title}</CardTitle>
        <CardDescription>Previous year question paper</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <Clock className="h-4 w-4 mx-auto mb-1 text-gray-600" />
              <p className="text-xs font-semibold">{test.duration} min</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <FileText className="h-4 w-4 mx-auto mb-1 text-gray-600" />
              <p className="text-xs font-semibold">{test.totalQuestions} Qs</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <BookOpen className="h-4 w-4 mx-auto mb-1 text-gray-600" />
              <p className="text-xs font-semibold">{test.totalMarks} Marks</p>
            </div>
          </div>
        </div>
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-4"
          onClick={onStartTest}
        >
          Start Test
        </Button>
      </CardContent>
    </Card>
  );
}
