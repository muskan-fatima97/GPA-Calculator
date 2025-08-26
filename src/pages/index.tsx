"use client";
import { useState } from "react";

export default function Home() {
  const [courseName, setCourseName] = useState("");
  const [creditHours, setCreditHours] = useState(3);
  const [numAssignments, setNumAssignments] = useState(0);
  const [numQuizzes, setNumQuizzes] = useState(0);
  const [assignments, setAssignments] = useState<{ obtained: number; total: number }[]>([]);
  const [quizzes, setQuizzes] = useState<{ obtained: number; total: number }[]>([]);
  const [midterm, setMidterm] = useState({ obtained: 0, total: 0 });
  const [finalTerm, setFinalTerm] = useState({ obtained: 0, total: 0 });
  const [result, setResult] = useState<{ percentage: number; grade: string; gpa: number } | null>(null);
  const [showResultOnly, setShowResultOnly] = useState(false); // 🔹 toggle view

  const gradeMapping = [
    { min: 85, grade: "A", gpa: 4.0 },
    { min: 80, grade: "A-", gpa: 3.67 },
    { min: 75, grade: "B+", gpa: 3.33 },
    { min: 70, grade: "B", gpa: 3.0 },
    { min: 65, grade: "B-", gpa: 2.67 },
    { min: 60, grade: "C+", gpa: 2.33 },
    { min: 55, grade: "C", gpa: 2.0 },
    { min: 50, grade: "C-", gpa: 1.67 },
    { min: 0, grade: "F", gpa: 0.0 },
  ];

  const handleAssignmentsChange = (count: number) => {
    setNumAssignments(count);
    setAssignments(Array.from({ length: count }, () => ({ obtained: 0, total: 0 })));
  };

  const handleQuizzesChange = (count: number) => {
    setNumQuizzes(count);
    setQuizzes(Array.from({ length: count }, () => ({ obtained: 0, total: 0 })));
  };

  const calculateGPA = () => {
    const assignmentAvg =
      assignments.reduce((sum, a) => sum + (a.total ? a.obtained / a.total : 0), 0) /
      (assignments.length || 1);
    const quizAvg =
      quizzes.reduce((sum, q) => sum + (q.total ? q.obtained / q.total : 0), 0) /
      (quizzes.length || 1);
    const midtermPct = midterm.total ? midterm.obtained / midterm.total : 0;
    const finalPct = finalTerm.total ? finalTerm.obtained / finalTerm.total : 0;

    const finalPercentage =
      assignmentAvg * 100 * 0.1 +
      quizAvg * 100 * 0.15 +
      midtermPct * 100 * 0.25 +
      finalPct * 100 * 0.5;

    const gradeInfo = gradeMapping.find((g) => finalPercentage >= g.min)!;
    setResult({ percentage: finalPercentage, grade: gradeInfo.grade, gpa: gradeInfo.gpa });

    setShowResultOnly(true); // 🔹 hide form & show result
  };

  const getMessage = (grade: string) => {
    if (grade === "A" || grade === "A-") return "🏆 Outstanding! Keep it up!";
    if (grade.startsWith("B")) return "👍 Great job! A little push and you’ll hit an A!";
    if (grade.startsWith("C")) return "📚 You passed! Now aim higher!";
    if (grade === "F") return "😭 Don’t give up — you can improve next time!";
    return "💪 Keep going!";
  };

  const resetForm = () => {
    setCourseName("");
    setCreditHours(3);
    setNumAssignments(0);
    setNumQuizzes(0);
    setAssignments([]);
    setQuizzes([]);
    setMidterm({ obtained: 0, total: 0 });
    setFinalTerm({ obtained: 0, total: 0 });
    setResult(null);
    setShowResultOnly(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-2xl shadow-2xl space-y-6">
         {!showResultOnly && (
          <>
        <h1 className="text-3xl font-bold text-center mb-6">COMSATS GPA Calculator</h1>
        {/* Course + Credit Hours */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">Course Name</label>
            <input
              type="text"
              className="w-full h-12 px-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Credit Hours</label>
            <input
              type="number"
              step="any"
              className="w-full h-12 px-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              value={creditHours}
              onChange={(e) => setCreditHours(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        {/* Assignments */}
        <div>
          <label className="block text-sm mb-2">Number of Assignments</label>
          <input
            type="number"
            className="w-full h-12 px-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all mb-4"
            value={numAssignments}
            onChange={(e) => handleAssignmentsChange(Number(e.target.value))}
          />
          {assignments.length > 0 && (
            <div className="space-y-4">
              {assignments.map((a, i) => (
                <div key={i} className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col w-full">
                    <label className="block text-sm mb-2">Total Marks</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Total"
                      className="h-12 px-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      value={a.total}
                      onChange={(e) => {
                        const updated = [...assignments];
                        updated[i].total = parseFloat(e.target.value) || 0;
                        setAssignments(updated);
                      }}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block text-sm mb-2">Obtained Marks</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Obtained"
                      className="h-12 px-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      value={a.obtained}
                      onChange={(e) => {
                        const updated = [...assignments];
                        updated[i].obtained = parseFloat(e.target.value) || 0;
                        setAssignments(updated);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Quizzes */}
        <div>
          <label className="block text-sm mb-2">Number of Quizzes</label>
          <input
            type="number"
            className="w-full h-12 px-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all mb-4"
            value={numQuizzes}
            onChange={(e) => handleQuizzesChange(Number(e.target.value))}
          />
          {quizzes.length > 0 && (
            <div className="space-y-4">
              {quizzes.map((q, i) => (
                <div key={i} className="grid grid-cols-2 gap-6">

                  <div className="flex flex-col w-full">
                    <label className="block text-sm mb-2">Total Marks</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Total"
                      className="h-12 px-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      value={q.total}
                      onChange={(e) => {
                        const updated = [...quizzes];
                        updated[i].total = parseFloat(e.target.value) || 0;
                        setQuizzes(updated);
                      }}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="block text-sm mb-2">Obtained Marks</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Obtained"
                      className="h-12 px-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      value={q.obtained}
                      onChange={(e) => {
                        const updated = [...quizzes];
                        updated[i].obtained = parseFloat(e.target.value) || 0;
                        setQuizzes(updated);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Midterm */}
        <div>
          <h1 className="text-lg font-bold text-center mb-4">Mid-term Marks</h1>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col w-full">
              <label className="block text-sm mb-2">Total Marks</label>
              <input
                type="number"
                step="any"
                placeholder="Total"
                className="w-full h-12 px-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                value={midterm.total}
                onChange={(e) => setMidterm({ ...midterm, total: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="block text-sm mb-2">Obtained Marks</label>
              <input
                type="number"
                step="any"
                placeholder="Obtained"
                className="w-full h-12 px-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                value={midterm.obtained}
                onChange={(e) => setMidterm({ ...midterm, obtained: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>
        {/* Final */}
        <div>
          <h1 className="text-lg font-bold text-center mb-4">Finals Marks</h1>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col w-full">
              <label className="block text-sm mb-2">Total Marks</label>
              <input
                type="number"
                step="any"
                placeholder="Total"
                className="w-full h-12 px-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                value={finalTerm.total}
                onChange={(e) => setFinalTerm({ ...finalTerm, total: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="block text-sm mb-2">Obtained Marks</label>
              <input
                type="number"
                step="any"
                placeholder="Obtained"
                className="w-full h-12 px-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                value={finalTerm.obtained}
                onChange={(e) => setFinalTerm({ ...finalTerm, obtained: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>
        <button
          onClick={calculateGPA}
          className="w-full h-12 rounded-xl text-lg hover:shadow-lg hover:shadow-primary/25 bg-gradient-to-r from-[#f759f6] via-purple-600 to-[#0070f3] transition-all duration-200"
        >
          Calculate GPA
        </button>
        </>
          )}
         {showResultOnly && result && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center">
            <div className="bg-gray-700 p-6 rounded-xl w-full">
              <p className="text-lg">Percentage: {result.percentage.toFixed(2)}%</p>
              <p className="text-lg">Grade: {result.grade}</p>
              <p className="text-lg">GPA: {result.gpa}</p>
              <p className="text-xl mt-4">{getMessage(result.grade)}</p>
            </div>
            <button
              onClick={resetForm}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
