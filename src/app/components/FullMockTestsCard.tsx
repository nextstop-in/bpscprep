import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { isTestExpired } from "../utils/calculations";
import type { MockTest } from "../data/mockData";

interface FullMockTestsCardProps {
  test: MockTest;
  isCompleted: boolean;
  onStartTest: (testId: string) => void;
}

export function FullMockTestsCard({ test, isCompleted, onStartTest }: FullMockTestsCardProps) {
  const expired = isTestExpired(test.expiryDate);
  const daysNum = test.expiryDate
    ? Math.ceil(
        (new Date(test.expiryDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <Card
      className={`hover:shadow-lg transition-all border flex flex-col ${
        expired ? "opacity-60 border-gray-300" : "hover:border-blue-300"
      }`}
    >
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Full Mock Test
          </Badge>
          {isCompleted && (
            <Badge className="bg-green-100 text-green-700 border-green-300">
              Completed
            </Badge>
          )}
          {expired && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Expired
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{test.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 mt-2">
          <Sparkles className="h-4 w-4" />
          {expired && <span className="text-gray-500">Expired</span>}
          {!expired && daysNum === null && (
            <span className="text-blue-600 font-medium">AI generated tests</span>
          )}
          {!expired && daysNum !== null && daysNum < 7 && (
            <span className="text-orange-600 font-medium">
              {daysNum} day{daysNum !== 1 ? "s" : ""} remaining
            </span>
          )}
          {!expired && daysNum !== null && daysNum >= 7 && (
            <span className="text-gray-600">Expires in {daysNum} days</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <p className="text-gray-600">Duration</p>
              <p className="font-semibold">{test.duration}m</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Questions</p>
              <p className="font-semibold">{test.totalQuestions}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Marks</p>
              <p className="font-semibold">{test.totalMarks}</p>
            </div>
          </div>
        </div>
        <Button
          className={`w-full mt-4 ${
            isCompleted
              ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          }`}
          onClick={() => onStartTest(test.id)}
          disabled={expired}
        >
          {isCompleted ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake Test
            </>
          ) : (
            "Start Test"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
