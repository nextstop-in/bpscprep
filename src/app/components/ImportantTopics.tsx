import { importantTopics } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Lightbulb } from "lucide-react";
import { Badge } from "./ui/badge";

export function ImportantTopics() {
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Important Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {importantTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{topic.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{topic.subject}</p>
                </div>
                <Badge className={`text-xs ${getImportanceColor(topic.importance)}`}>
                  {topic.importance}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
