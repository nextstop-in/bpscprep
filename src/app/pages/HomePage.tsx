import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useFullMockTestsQuery, useSubjectWiseTestsQuery, useTestsBySubjectQuery } from "../hooks/useTestsQuery";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { FileText, BookOpen, Filter, Sparkles, Award, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Skeleton } from "../components/ui/skeleton";
import { FullMockTestsCard } from "../components/FullMockTestsCard";
import { SubjectWiseTestsCard } from "../components/SubjectWiseTestsCard";

export function HomePage() {
  const navigate = useNavigate();
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set());
  
  // Fetch tests using dedicated React Query hooks
  const { data: fullMockTests = [], isLoading: isFullMockLoading, error: fullMockError } = useFullMockTestsQuery();
  const { data: subjectWiseTests = [], isLoading: isSubjectWiseLoading, error: subjectWiseError } = useSubjectWiseTestsQuery();
  const { data: filteredSubjectTests = [], isLoading: isFilteredLoading } = useTestsBySubjectQuery(
    filterSubject !== "all" ? filterSubject : undefined
  );

  useEffect(() => {
    // Load completed tests from localStorage
    const results = JSON.parse(localStorage.getItem("bpsc_results") || "[]");
    const testIds = new Set(results.map((result: any) => result.testId));
    setCompletedTests(testIds as any);
  }, []);

  // Get unique subjects from subject-wise tests
  const uniqueSubjects = Array.from(new Set(subjectWiseTests.map((test) => test.subject)));
  const subjects = ["all", ...uniqueSubjects];

  // Determine which filtered tests to show
  const displayedSubjectTests = filterSubject === "all" ? subjectWiseTests : filteredSubjectTests;

  const handleStartTest = (testId: string) => {
    navigate(`/dashboard/mock-test/${testId}`);
  };

  // Calculate stats from all available tests
  const allTests = [...fullMockTests, ...subjectWiseTests];
  const totalTests = allTests.length;
  const totalQuestions = allTests.reduce((acc, test) => acc + test.totalQuestions, 0);

  // Check if any errors occurred
  const hasError = fullMockError || subjectWiseError;
  const isLoading = isFullMockLoading || isSubjectWiseLoading;

  return (
    <div className="space-y-8">
      {/* Error State */}
      {hasError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Failed to load tests</h3>
            <p className="text-red-700 text-sm mt-1">
              {fullMockError?.message || subjectWiseError?.message || "An error occurred"}
            </p>
            <Button
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-600 hover:bg-red-700"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Loading State - Show skeleton */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        </div>
      )}

      {/* Content - Only show when loaded and no error */}
      {!isLoading && !hasError && (
      <>
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
            Supercharge your prep with weekly full-length mocks, subject-focused drills, and timed real-exam practice that builds sharp, exam-ready confidence.
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
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-gradient-to-r from-blue-600 to-purple-600 p-[3px] rounded-xl">
          <TabsTrigger value="full-mock" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-700">
            Full Mock Tests
          </TabsTrigger>
          <TabsTrigger value="subject-wise" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-700">
            Subject-wise Tests
          </TabsTrigger>
        </TabsList>

        {/* Full Mock Tests Tab */}
        <TabsContent value="full-mock" className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Full Mock Tests</h3>
            <p className="text-gray-600">Weekly comprehensive tests covering all subjects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fullMockTests.map((test) => (
              <FullMockTestsCard
                key={test.id}
                test={test}
                isCompleted={completedTests.has(test.id)}
                onStartTest={handleStartTest}
              />
            ))}
          </div>
        </TabsContent>

        {/* Subject-wise Tests Tab */}
        <TabsContent value="subject-wise" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Subject-wise Mock Tests</h3>
              <p className="text-gray-600">Practice with weekly topic drills, time-bound simulations, and curriculum-aligned challenges designed to boost confidence and exam readiness.</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-48 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 focus-visible:ring-2 focus-visible:ring-blue-400" data-size="default">
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
            {displayedSubjectTests.map((test) => (
              <SubjectWiseTestsCard
                key={test.id}
                test={test}
                isCompleted={completedTests.has(test.id)}
                onStartTest={handleStartTest}
              />
            ))}
          </div>

          {displayedSubjectTests.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No tests found for the selected subject.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      </>
      )}
    </div>
  );
}