import { MockTest } from "../data/mockData";

interface ApiResponse {
  weekId: string;
  tests: ApiTest[];
}

interface ApiTest {
  testId: string;
  title: string;
  type: "FULL" | "PARTIAL" | string;
  subject: string;
  duration: number;
  totalQuestions: number;
  expiry: string;
}

const API_BASE_URL = "https://66e2rvyfvj.execute-api.ap-south-1.amazonaws.com/prod";

// Map API subject names to standard subject names
const subjectMapping: Record<string, string> = {
  GENERAL: "General Studies",
  HISTORY: "History",
  GEOGRAPHY: "Geography",
  SCIENCE: "Science",
  CURRENT_AFFAIRS: "Current Affairs",
  POLITY: "Polity",
};

// Transform API response to MockTest format
const transformApiResponse = (apiTest: ApiTest): MockTest => {
  return {
    id: apiTest.testId,
    title: apiTest.title,
    subject: subjectMapping[apiTest.subject] || apiTest.subject,
    duration: apiTest.duration,
    totalMarks: apiTest.totalQuestions, // Using totalQuestions as totalMarks
    totalQuestions: apiTest.totalQuestions,
    questions: [], // Questions will be fetched separately when test is opened
    expiryDate: apiTest.expiry,
    year: new Date(apiTest.expiry).getFullYear().toString(),
  };
};

export const fetchMockTests = async (): Promise<MockTest[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tests`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    
    // Transform API tests to MockTest format
    const tests = data.tests.map(transformApiResponse);
    
    return tests;
  } catch (error) {
    console.error("Failed to fetch mock tests:", error);
    throw error;
  }
};

export const fetchTestById = async (testId: string): Promise<MockTest | null> => {
  try {
    const tests = await fetchMockTests();
    return tests.find(test => test.id === testId) || null;
  } catch (error) {
    console.error("Failed to fetch test:", error);
    return null;
  }
};
