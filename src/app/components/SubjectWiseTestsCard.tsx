import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { isTestExpired } from "../utils/calculations";
import type { MockTest } from "../data/mockData";

interface SubjectWiseTestsCardProps {
  test: MockTest;
  isCompleted: boolean;
  onStartTest: (testId: string) => void;
}

export function SubjectWiseTestsCard({ test, isCompleted, onStartTest }: SubjectWiseTestsCardProps) {
  const expired = isTestExpired(test.expiryDate);
  const daysNum = test.expiryDate
    ? Math.ceil(
        (new Date(test.expiryDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;
console.log("Test sw:", test);
  return (
    <Card
      className={`hover:shadow-lg transition-all border flex flex-col ${
        expired ? "opacity-60 border-gray-300" : "hover:border-blue-300"
      }`}
    >
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {test.subject}
            </Badge>
            {/* <Badge variant="outline">W{test.weekId}</Badge> */}
          </div>
          {isCompleted && (
            <Badge className="bg-green-100 text-green-700 border-green-300">
              Completed
            </Badge>
          )}
        </div>
        {expired && (
          <Badge variant="destructive" className="gap-1 w-fit mb-2">
            <AlertCircle className="h-3 w-3" />
            Expired
          </Badge>
        )}
        <CardTitle className="text-base">{test.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 mt-1">
          <Sparkles className="h-3 w-3" />
          {expired && <span className="text-gray-500 text-xs">Expired</span>}
          {!expired && daysNum === null && (
            <span className="text-blue-600 font-medium text-xs">AI generated tests</span>
          )}
          {!expired && daysNum !== null && daysNum < 7 && (
            <span className="text-orange-600 font-medium text-xs">
              {daysNum} day{daysNum !== 1 ? "s" : ""} left
            </span>
          )}
          {!expired && daysNum !== null && daysNum >= 7 && (
            <span className="text-gray-600 text-xs">{daysNum} days left</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <p className="text-gray-600">Duration</p>
              <p className="font-semibold text-foreground">{test.duration} min</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Questions</p>
              <p className="font-semibold text-foreground">{test.totalQuestions}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Marks</p>
              <p className="font-semibold text-foreground">{test.totalQuestions}</p>
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
              Retake
            </>
          ) : (
            "Start Test"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
