import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { mockTests } from "../data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Clock, FileText, BookOpen, Filter, Sparkles, Target, Award, TrendingUp, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function HomePage() {
  const navigate = useNavigate();
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load completed tests from localStorage
    const results = JSON.parse(localStorage.getItem("bpsc_results") || "[]");
    const testIds = new Set(results.map((result: any) => result.testId));
    setCompletedTests(testIds);
  }, []);

  // Get unique subjects
  const allSubjects = Array.from(new Set(mockTests.map((test) => test.subject)));
  const subjects = ["all", ...allSubjects];

  // Separate Full Mock tests and Subject-wise tests
  const fullMockTests = mockTests.filter((test) => test.subject === "Full Mock");
  const subjectWiseTests = mockTests.filter((test) => test.subject !== "Full Mock");

  // Filter tests
  const filteredSubjectTests =
    filterSubject === "all"
      ? subjectWiseTests
      : subjectWiseTests.filter((test) => test.subject === filterSubject);

  // Helper function to check if test is expired
  const isTestExpired = (expiryDate?: string): boolean => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  // Helper function to get days remaining
  const getDaysRemaining = (expiryDate?: string): number => {
    if (!expiryDate) return Infinity;
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleStartTest = (testId: string) => {
    navigate(`/dashboard/mock-test/${testId}`);
  };

  // Calculate stats
  const totalTests = mockTests.length;
  const totalQuestions = mockTests.reduce((acc, test) => acc + test.questions.length, 0);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 md:p-12 text-white overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-1">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              Exam Preparation Platform
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Master Your BPSC Exam
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl">
            Practice with 21 weekly mock tests for each subject. All tests have expiry dates to simulate real exam conditions.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-5 w-5" />
                <span className="text-2xl font-bold">{totalTests}</span>
              </div>
              <p className="text-sm text-blue-100">Mock Tests</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-5 w-5" />
                <span className="text-2xl font-bold">{totalQuestions}</span>
              </div>
              <p className="text-sm text-blue-100">Questions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-5 w-5" />
                <span className="text-2xl font-bold">{completedTests.size}</span>
              </div>
              <p className="text-sm text-blue-100">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tests Section with Tabs */}
      <Tabs defaultValue="full-mock" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="full-mock">Full Mock Tests</TabsTrigger>
          <TabsTrigger value="subject-wise">Subject-wise Tests</TabsTrigger>
        </TabsList>

        {/* Full Mock Tests Tab */}
        <TabsContent value="full-mock" className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Full Mock Tests</h3>
            <p className="text-gray-600">21 weekly comprehensive tests covering all subjects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fullMockTests.map((test) => {
              const isCompleted = completedTests.has(test.id);
              const isExpired = isTestExpired(test.expiryDate);
              const daysRemaining = getDaysRemaining(test.expiryDate);

              return (
                <Card key={test.id} className={`hover:shadow-lg transition-all border flex flex-col ${
                  isExpired ? "opacity-60 border-gray-300" : "hover:border-blue-300"
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        Week {test.weekNumber}
                      </Badge>
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-700 border-green-300">
                          Completed
                        </Badge>
                      )}
                      {isExpired && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Expired
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{test.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4" />
                      {!isExpired && daysRemaining < 7 && (
                        <span className="text-orange-600 font-medium">
                          {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
                        </span>
                      )}
                      {!isExpired && daysRemaining >= 7 && (
                        <span className="text-gray-600">
                          Expires in {daysRemaining} days
                        </span>
                      )}
                      {isExpired && (
                        <span className="text-gray-500">Expired</span>
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
                          <p className="font-semibold">{test.questions.length}</p>
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
                      onClick={() => handleStartTest(test.id)}
                      disabled={isExpired}
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
            })}
          </div>
        </TabsContent>

        {/* Subject-wise Tests Tab */}
        <TabsContent value="subject-wise" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Subject-wise Mock Tests</h3>
              <p className="text-gray-600">21 weekly tests for each subject</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject === "all" ? "All Subjects" : subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjectTests.map((test) => {
              const isCompleted = completedTests.has(test.id);
              const isExpired = isTestExpired(test.expiryDate);
              const daysRemaining = getDaysRemaining(test.expiryDate);

              return (
                <Card key={test.id} className={`hover:shadow-lg transition-all border flex flex-col ${
                  isExpired ? "opacity-60 border-gray-300" : "hover:border-blue-300"
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {test.subject}
                        </Badge>
                        <Badge variant="outline">
                          W{test.weekNumber}
                        </Badge>
                      </div>
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-700 border-green-300">
                          Completed
                        </Badge>
                      )}
                    </div>
                    {isExpired && (
                      <Badge variant="destructive" className="gap-1 w-fit mb-2">
                        <AlertCircle className="h-3 w-3" />
                        Expired
                      </Badge>
                    )}
                    <CardTitle className="text-base">{test.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3" />
                      {!isExpired && daysRemaining < 7 && (
                        <span className="text-orange-600 font-medium text-xs">
                          {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left
                        </span>
                      )}
                      {!isExpired && daysRemaining >= 7 && (
                        <span className="text-gray-600 text-xs">
                          {daysRemaining} days left
                        </span>
                      )}
                      {isExpired && (
                        <span className="text-gray-500 text-xs">Expired</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <p className="text-gray-600">Duration</p>
                          <p className="font-semibold">{test.duration}m</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Questions</p>
                          <p className="font-semibold">{test.questions.length}</p>
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
                      onClick={() => handleStartTest(test.id)}
                      disabled={isExpired}
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
            })}
          </div>

          {filteredSubjectTests.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No tests found for the selected subject.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}