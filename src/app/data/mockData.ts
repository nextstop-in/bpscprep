export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
}

export interface MockTest {
  id: string;
  title: string;
  subject: string;
  year?: string;
  duration: number; // in minutes
  totalMarks: number;
  totalQuestions: number;
  questions?: Question[];
  expiryDate?: string; // ISO date string
  weekNumber?: number;
}

export interface Topper {
  id: string;
  rank: number;
  name: string;
  score: number;
  totalMarks: number;
  testId: string;
}

export interface Topic {
  id: string;
  title: string;
  subject: string;
  importance: "High" | "Medium" | "Low";
}

// Helper function to generate weekly test expiry dates
const generateExpiryDate = (weekNumber: number): string => {
  const startDate = new Date('2026-03-26'); // Today's date
  const expiryDate = new Date(startDate);
  expiryDate.setDate(startDate.getDate() + (weekNumber * 7));
  return expiryDate.toISOString();
};

// Base questions for each subject
const currentAffairsQuestions: Question[] = [
  {
    id: "q1",
    question: "Who was the first President of India?",
    options: ["Dr. Rajendra Prasad", "Dr. S. Radhakrishnan", "Jawaharlal Nehru", "Sardar Patel"],
    correctAnswer: 0,
    subject: "Current Affairs",
  },
  {
    id: "q2",
    question: "Which river is known as the 'Sorrow of Bihar'?",
    options: ["Ganga", "Kosi", "Gandak", "Son"],
    correctAnswer: 1,
    subject: "Current Affairs",
  },
  {
    id: "q3",
    question: "When was Bihar separated from Bengal?",
    options: ["1905", "1912", "1920", "1935"],
    correctAnswer: 1,
    subject: "Current Affairs",
  },
  {
    id: "q4",
    question: "The capital of Mauryan Empire was?",
    options: ["Rajgriha", "Pataliputra", "Vaishali", "Nalanda"],
    correctAnswer: 1,
    subject: "Current Affairs",
  },
  {
    id: "q5",
    question: "Which freedom fighter from Bihar is known as 'Bihar Vibhuti'?",
    options: ["Dr. Rajendra Prasad", "Anugrah Narayan Sinha", "Jai Prakash Narayan", "Sri Krishna Sinha"],
    correctAnswer: 1,
    subject: "Current Affairs",
  },
];

const historyQuestions: Question[] = [
  {
    id: "q6",
    question: "The first session of the Indian National Congress was held in?",
    options: ["Mumbai", "Kolkata", "Delhi", "Chennai"],
    correctAnswer: 0,
    subject: "History",
  },
  {
    id: "q7",
    question: "Ashoka belonged to which dynasty?",
    options: ["Maurya", "Gupta", "Mughal", "Chola"],
    correctAnswer: 0,
    subject: "History",
  },
  {
    id: "q8",
    question: "The Battle of Plassey was fought in?",
    options: ["1757", "1764", "1857", "1947"],
    correctAnswer: 0,
    subject: "History",
  },
  {
    id: "q9",
    question: "Mahatma Gandhi launched the Quit India Movement in?",
    options: ["1920", "1930", "1942", "1945"],
    correctAnswer: 2,
    subject: "History",
  },
  {
    id: "q10",
    question: "The Vijayanagara Empire was founded in?",
    options: ["1336", "1526", "1206", "1398"],
    correctAnswer: 0,
    subject: "History",
  },
];

const geographyQuestions: Question[] = [
  {
    id: "q11",
    question: "Which is the longest river in India?",
    options: ["Ganga", "Brahmaputra", "Godavari", "Yamuna"],
    correctAnswer: 0,
    subject: "Geography",
  },
  {
    id: "q12",
    question: "Mount Everest is located in which mountain range?",
    options: ["Aravalli", "Vindhya", "Himalaya", "Western Ghats"],
    correctAnswer: 2,
    subject: "Geography",
  },
  {
    id: "q13",
    question: "Which state in India has the largest coastline?",
    options: ["Tamil Nadu", "Gujarat", "Maharashtra", "Andhra Pradesh"],
    correctAnswer: 1,
    subject: "Geography",
  },
  {
    id: "q14",
    question: "The Tropic of Cancer passes through how many Indian states?",
    options: ["6", "7", "8", "9"],
    correctAnswer: 2,
    subject: "Geography",
  },
  {
    id: "q15",
    question: "Which Indian state has the highest forest cover?",
    options: ["Madhya Pradesh", "Arunachal Pradesh", "Chhattisgarh", "Odisha"],
    correctAnswer: 0,
    subject: "Geography",
  },
];

const polityQuestions: Question[] = [
  {
    id: "q16",
    question: "How many fundamental rights are mentioned in the Indian Constitution?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 1,
    subject: "Polity",
  },
  {
    id: "q17",
    question: "Who is known as the Father of the Indian Constitution?",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Dr. B.R. Ambedkar", "Sardar Patel"],
    correctAnswer: 2,
    subject: "Polity",
  },
  {
    id: "q18",
    question: "The Indian Constitution came into effect on?",
    options: ["15 August 1947", "26 January 1950", "26 November 1949", "15 August 1950"],
    correctAnswer: 1,
    subject: "Polity",
  },
  {
    id: "q19",
    question: "How many members can be nominated by the President to Rajya Sabha?",
    options: ["10", "12", "14", "15"],
    correctAnswer: 1,
    subject: "Polity",
  },
  {
    id: "q20",
    question: "Which article of the Constitution deals with Right to Education?",
    options: ["Article 19", "Article 21", "Article 21A", "Article 24"],
    correctAnswer: 2,
    subject: "Polity",
  },
];

const economicsQuestions: Question[] = [
  {
    id: "q21",
    question: "What does GDP stand for?",
    options: ["Gross Domestic Product", "General Domestic Product", "Gross Development Product", "General Development Product"],
    correctAnswer: 0,
    subject: "Economics",
  },
  {
    id: "q22",
    question: "The currency of India is regulated by?",
    options: ["Ministry of Finance", "Reserve Bank of India", "State Bank of India", "SEBI"],
    correctAnswer: 1,
    subject: "Economics",
  },
  {
    id: "q23",
    question: "Which Five Year Plan is currently in operation in India?",
    options: ["12th", "13th", "None - discontinued", "15th"],
    correctAnswer: 2,
    subject: "Economics",
  },
  {
    id: "q24",
    question: "What is the primary objective of fiscal policy?",
    options: ["Control inflation", "Economic growth", "Income distribution", "All of the above"],
    correctAnswer: 3,
    subject: "Economics",
  },
  {
    id: "q25",
    question: "GST was implemented in India in which year?",
    options: ["2014", "2016", "2017", "2018"],
    correctAnswer: 2,
    subject: "Economics",
  },
];

const aptitudeQuestions: Question[] = [
  {
    id: "q26",
    question: "If 20% of a number is 50, what is the number?",
    options: ["200", "250", "300", "350"],
    correctAnswer: 1,
    subject: "Aptitude",
  },
  {
    id: "q27",
    question: "A train travels 60 km in 45 minutes. What is its speed in km/h?",
    options: ["60", "70", "80", "90"],
    correctAnswer: 2,
    subject: "Aptitude",
  },
  {
    id: "q28",
    question: "The average of 5 consecutive numbers is 18. What is the largest number?",
    options: ["18", "19", "20", "21"],
    correctAnswer: 2,
    subject: "Aptitude",
  },
  {
    id: "q29",
    question: "If the ratio of two numbers is 3:4 and their sum is 35, what is the smaller number?",
    options: ["12", "15", "18", "20"],
    correctAnswer: 1,
    subject: "Aptitude",
  },
  {
    id: "q30",
    question: "What is the compound interest on Rs. 10,000 at 10% per annum for 2 years?",
    options: ["Rs. 2000", "Rs. 2100", "Rs. 2200", "Rs. 2500"],
    correctAnswer: 1,
    subject: "Aptitude",
  },
];

const reasoningQuestions: Question[] = [
  {
    id: "q31",
    question: "If HOUSE is coded as FQSTN, how is CHAIR coded?",
    options: ["DIBJS", "AFGHS", "DIBHS", "AEJHS"],
    correctAnswer: 3,
    subject: "Reasoning",
  },
  {
    id: "q32",
    question: "Find the odd one out: 3, 5, 7, 12, 13, 17, 19",
    options: ["3", "5", "7", "12"],
    correctAnswer: 3,
    subject: "Reasoning",
  },
  {
    id: "q33",
    question: "If all roses are flowers and some flowers are red, then?",
    options: ["All roses are red", "Some roses are red", "No rose is red", "Cannot be determined"],
    correctAnswer: 3,
    subject: "Reasoning",
  },
  {
    id: "q34",
    question: "Complete the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correctAnswer: 1,
    subject: "Reasoning",
  },
  {
    id: "q35",
    question: "In a certain code, MOBILE is written as JFKFFM. How is LAPTOP written?",
    options: ["FZGFUJ", "FZGGLM", "FZGGLJ", "IZGFUJ"],
    correctAnswer: 0,
    subject: "Reasoning",
  },
];

const englishGrammarQuestions: Question[] = [
  {
    id: "q36",
    question: "Choose the correct sentence:",
    options: ["He don't know the answer", "He doesn't knows the answer", "He doesn't know the answer", "He don't knows the answer"],
    correctAnswer: 2,
    subject: "English Grammar",
  },
  {
    id: "q37",
    question: "What is the plural of 'criterion'?",
    options: ["Criterions", "Criteria", "Criterias", "Criterion"],
    correctAnswer: 1,
    subject: "English Grammar",
  },
  {
    id: "q38",
    question: "Identify the type of sentence: 'Please close the door.'",
    options: ["Declarative", "Interrogative", "Imperative", "Exclamatory"],
    correctAnswer: 2,
    subject: "English Grammar",
  },
  {
    id: "q39",
    question: "Which is the correct passive voice? 'She writes a letter.'",
    options: ["A letter is written by her", "A letter was written by her", "A letter is being written by her", "A letter has been written by her"],
    correctAnswer: 0,
    subject: "English Grammar",
  },
  {
    id: "q40",
    question: "Choose the correct preposition: 'He is good ___ mathematics.'",
    options: ["in", "at", "on", "with"],
    correctAnswer: 1,
    subject: "English Grammar",
  },
];

// Helper to generate unique question IDs
const generateQuestionId = (baseId: string, week: number): string => {
  return `${baseId}_w${week}`;
};

// Generate 21 weekly tests for each subject
const generateWeeklyTests = (): MockTest[] => {
  const tests: MockTest[] = [];
  const subjects = [
    { name: "Current Affairs", questions: currentAffairsQuestions, duration: 120, marks: 100 },
    { name: "History", questions: historyQuestions, duration: 90, marks: 75 },
    { name: "Geography", questions: geographyQuestions, duration: 90, marks: 75 },
    { name: "Polity", questions: polityQuestions, duration: 120, marks: 100 },
    { name: "Economics", questions: economicsQuestions, duration: 90, marks: 75 },
    { name: "Aptitude", questions: aptitudeQuestions, duration: 60, marks: 50 },
    { name: "Reasoning", questions: reasoningQuestions, duration: 60, marks: 50 },
    { name: "English Grammar", questions: englishGrammarQuestions, duration: 60, marks: 50 },
  ];

  let testIdCounter = 1;

  subjects.forEach((subject) => {
    for (let week = 1; week <= 21; week++) {
      const weekQuestions = subject.questions.map((q) => ({
        ...q,
        id: generateQuestionId(q.id, week),
      }));

      tests.push({
        id: `test_${testIdCounter}`,
        title: `${subject.name} - Week ${week}`,
        subject: subject.name,
        duration: subject.duration,
        totalMarks: subject.marks,
        totalQuestions: weekQuestions.length,
        questions: weekQuestions,
        expiryDate: generateExpiryDate(week),
        weekNumber: week,
      });

      testIdCounter++;
    }
  });

  // Generate 21 Full Mock Tests
  for (let week = 1; week <= 21; week++) {
    const allWeekQuestions: Question[] = [];

    subjects.forEach((subject) => {
      subject.questions.forEach((q) => {
        allWeekQuestions.push({
          ...q,
          id: generateQuestionId(q.id, week),
        });
      });
    });

    tests.push({
      id: `full_mock_${week}`,
      title: `Full Mock Test - Week ${week}`,
      subject: "Full Mock",
      duration: 180,
      totalMarks: allWeekQuestions.length * 5,
      totalQuestions: allWeekQuestions.length,
      questions: allWeekQuestions,
      expiryDate: generateExpiryDate(week),
      weekNumber: week,
    });
  }

  return tests;
};

export const mockTests: MockTest[] = generateWeeklyTests();

export const toppers: Topper[] = [
  { id: "1", rank: 1, name: "Amit Kumar Singh", score: 95, totalMarks: 100, testId: "1" },
  { id: "2", rank: 2, name: "Priya Sharma", score: 92, totalMarks: 100, testId: "1" },
  { id: "3", rank: 3, name: "Rahul Verma", score: 90, totalMarks: 100, testId: "1" },
  { id: "4", rank: 4, name: "Sneha Kumari", score: 88, totalMarks: 100, testId: "1" },
  { id: "5", rank: 5, name: "Vikash Kumar", score: 87, totalMarks: 100, testId: "2" },
  { id: "6", rank: 6, name: "Anita Singh", score: 85, totalMarks: 100, testId: "2" },
  { id: "7", rank: 7, name: "Rajesh Kumar", score: 84, totalMarks: 100, testId: "3" },
  { id: "8", rank: 8, name: "Pooja Kumari", score: 82, totalMarks: 100, testId: "3" },
];

export const importantTopics: Topic[] = [
  { id: "1", title: "Indian Constitution Basics", subject: "Polity", importance: "High" },
  { id: "2", title: "Fundamental Rights & Duties", subject: "Polity", importance: "High" },
  { id: "3", title: "Ancient Indian History", subject: "History", importance: "High" },
  { id: "4", title: "Freedom Movement", subject: "History", importance: "High" },
  { id: "5", title: "Indian Geography - Rivers", subject: "Geography", importance: "High" },
  { id: "6", title: "Climate & Vegetation", subject: "Geography", importance: "Medium" },
  { id: "7", title: "Bihar Special GK", subject: "Current Affairs", importance: "High" },
  { id: "8", title: "Economic Development", subject: "Economics", importance: "Medium" },
  { id: "9", title: "Current Affairs 2024-2026", subject: "Current Affairs", importance: "High" },
  { id: "10", title: "Science & Technology", subject: "Science", importance: "Medium" },
];
