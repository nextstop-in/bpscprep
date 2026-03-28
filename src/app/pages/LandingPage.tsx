import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { LandingPageHeader } from "../components/LandingPageHeader";
import { MockTestCard } from "../components/MockTestCard";
import { useTests } from "../hooks/useTests";
import {
  Clock,
  FileText,
  BookOpen,
  Sparkles,
  Target,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  Users,
  BarChart,
  Shield,
  AlertCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";

export function LandingPage() {
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { tests, loading, error } = useTests();

  const totalTests = tests.length;
  const totalQuestions = tests.reduce((acc, test) => acc + test.totalMarks, 0);
  const uniqueSubjects = Array.from(new Set(tests.map((test) => test.subject)));

  const handleTestClick = () => {
    setShowLoginDialog(true);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const features = [
    {
      icon: BookOpen,
      title: "Previous Year Papers",
      description: "Access authentic BPSC previous year question papers",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Target,
      title: "Subject-wise Practice",
      description: "Focus on specific subjects to strengthen your preparation",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: BarChart,
      title: "Performance Analytics",
      description: "Track your progress and identify areas for improvement",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Users,
      title: "Compete with Toppers",
      description: "See where you stand among top performers",
      color: "bg-orange-100 text-orange-600"
    },
  ];

  const benefits = [
    "Real exam-like interface and timing",
    "Detailed solutions and explanations",
    "Subject-wise performance tracking",
    "Custom test creation",
    "Regular content updates",
    "Mobile-friendly platform"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      <LandingPageHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-12 md:p-16 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
            <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-white/5 rounded-full"></div>
            
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-6 w-6" />
                <span className="text-sm font-medium bg-white/20 px-4 py-1.5 rounded-full">
                  India's Trusted BPSC Preparation Platform
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Master Your BPSC Exam with Confidence
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Practice with authentic previous year papers, subject-wise tests, and custom mock exams. 
                Join thousands of successful candidates in their BPSC preparation journey.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                <Button 
                  size="lg"
                  onClick={handleLoginRedirect}
                  className="bg-transparent border-2 border-white text-white hover:bg-white/20 text-lg px-10 h-14 rounded-full font-semibold shadow-lg backdrop-blur-sm"
                >
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  onClick={() => document.getElementById('tests')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-transparent border-2 border-white text-white hover:bg-white/20 hover:text-white text-lg px-10 h-14 rounded-full font-semibold shadow-lg backdrop-blur-sm"
                >
                  Explore Tests
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-2xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-6 w-6" />
                    <span className="text-3xl font-bold">{totalTests}</span>
                  </div>
                  <p className="text-sm text-blue-100">Mock Tests</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-3xl font-bold">{totalQuestions}</span>
                  </div>
                  <p className="text-sm text-blue-100">Questions</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="h-6 w-6" />
                    <span className="text-3xl font-bold">{uniqueSubjects.length}</span>
                  </div>
                  <p className="text-sm text-blue-100">Subjects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to prepare effectively for BPSC examinations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-2 hover:border-purple-300 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium text-sm">Premium Features</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Everything You Need to Succeed
                </h2>
                <p className="text-gray-600 mb-8">
                  Our comprehensive platform provides all the tools and resources you need 
                  to excel in your BPSC examination.
                </p>
                <Button 
                  size="lg"
                  onClick={handleLoginRedirect}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Start Practicing Now
                </Button>
              </div>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mt-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-gray-700 font-medium">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Available Tests Preview */}
          <div id="tests">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Available Mock Tests
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Preview our collection of BPSC mock tests. Login to start practicing!
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading mock tests...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900">Failed to load tests</h3>
                  <p className="text-red-700 text-sm mt-1">{error.message}</p>
                  <Button 
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="mt-3 bg-red-600 hover:bg-red-700"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : tests.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tests.slice(0, 6).map((test) => (
                    <MockTestCard 
                      key={test.id}
                      test={test}
                      onStartTest={handleTestClick}
                    />
                  ))}
                </div>

                {tests.length > 6 && (
                  <div className="text-center mt-8">
                    <p className="text-gray-600 mb-4">
                      +{tests.length - 6} more tests available
                    </p>
                    <Button 
                      size="lg"
                      onClick={handleLoginRedirect}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      View All Tests
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No tests available at the moment.</p>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your BPSC Journey with bpscprep.in?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of aspirants preparing for BPSC examinations on India's most trusted preparation platform.
            </p>
            <Button 
              size="lg"
              onClick={handleLoginRedirect}
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 h-14"
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please login or create an account to access mock tests and track your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={handleLoginRedirect}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Login / Sign Up
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}