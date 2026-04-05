import { toppers } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trophy, Medal } from "lucide-react";
import { Badge } from "./ui/badge";

export function ToppersList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {toppers.slice(0, 5).map((topper) => (
            <div
              key={topper.id}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {topper.rank === 1 ? (
                    <Medal className="h-6 w-6 text-yellow-500" />
                  ) : topper.rank === 2 ? (
                    <Medal className="h-6 w-6 text-gray-400" />
                  ) : topper.rank === 3 ? (
                    <Medal className="h-6 w-6 text-orange-600" />
                  ) : (
                    <div className="h-6 w-6 flex items-center justify-center bg-blue-100 rounded-full text-xs font-bold text-blue-600">
                      {topper.rank}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{topper.name}</p>
                  <p className="text-xs text-gray-500">Rank {topper.rank}</p>
                </div>
              </div>
              <Badge variant="secondary" className="font-bold">
                {topper.score}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
