"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/src/components/navbar";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useToast } from "@/src/components/ui/use-toast";
import { Trash2, Clock, FileText } from "lucide-react";

// Mock questions data (in a real app, this would come from a database)
const mockQuestions = [
  {
    id: "1",
    text: "What is the capital of France?",
    type: "multiple-choice",
    difficulty: "easy",
    points: 1,
  },
  {
    id: "2",
    text: "The Earth is flat.",
    type: "true-false",
    difficulty: "easy",
    points: 1,
  },
  {
    id: "3",
    text: "Explain the concept of object-oriented programming.",
    type: "essay",
    difficulty: "hard",
    points: 5,
  },
  {
    id: "4",
    text: "What is the main function of the mitochondria in a cell?",
    type: "short-answer",
    difficulty: "medium",
    points: 2,
  },
  {
    id: "5",
    text: "Match the following countries with their capitals.",
    type: "matching",
    difficulty: "medium",
    points: 3,
  },
  {
    id: "6",
    text: "The process of photosynthesis converts [blank] and [blank] into [blank] and [blank].",
    type: "fill-blanks",
    difficulty: "medium",
    points: 2,
  },
];

export default function CreateExamPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [exam, setExam] = useState({
    title: "",
    description: "",
    duration: 60, // minutes
    passingScore: 70, // percentage
    questions: [] as string[],
  });
  const [selectionMethod, setSelectionMethod] = useState("template");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading(false);
  }, [router]);

  const handleSelectQuestion = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleAddSelectedQuestions = () => {
    setExam({
      ...exam,
      questions: [...exam.questions, ...selectedQuestions],
    });
    setSelectedQuestions([]);

    toast({
      title: "Questions added",
      description: `${selectedQuestions.length} questions have been added to the exam.`,
    });
  };

  const handleRemoveQuestion = (questionId: string) => {
    setExam({
      ...exam,
      questions: exam.questions.filter((id) => id !== questionId),
    });
  };

  const handleCreateExam = () => {
    // Validate exam
    if (!exam.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for the exam.",
        variant: "destructive",
      });
      return;
    }

    if (exam.questions.length === 0) {
      toast({
        title: "No questions",
        description: "Please add at least one question to the exam.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would save the exam to a database
    // For this demo, we'll just show a success message
    toast({
      title: "Exam created",
      description: "Your exam has been created successfully.",
    });

    // Redirect to exams list (not implemented in this demo)
    router.push("/templates");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Exam</h1>
          <p className="mt-2 text-muted-foreground">
            Design your exam by adding questions and setting parameters
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Left column - Exam details */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Exam Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exam-title">Exam Title</Label>
                  <Input
                    id="exam-title"
                    placeholder="Enter exam title"
                    value={exam.title}
                    onChange={(e) =>
                      setExam({ ...exam, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exam-description">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="exam-description"
                    placeholder="Enter exam description"
                    value={exam.description}
                    onChange={(e) =>
                      setExam({ ...exam, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exam-duration">Duration (minutes)</Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="exam-duration"
                      type="number"
                      min="1"
                      value={exam.duration}
                      onChange={(e) =>
                        setExam({
                          ...exam,
                          duration: Number.parseInt(e.target.value) || 60,
                        })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave at default value for unlimited time
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passing-score">Passing Score (%)</Label>
                  <Input
                    id="passing-score"
                    type="number"
                    min="0"
                    max="100"
                    value={exam.passingScore}
                    onChange={(e) =>
                      setExam({
                        ...exam,
                        passingScore: Number.parseInt(e.target.value) || 70,
                      })
                    }
                  />
                </div>

                <div className="pt-4">
                  <Button className="w-full" onClick={handleCreateExam}>
                    Create Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Question selection */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="template"
                  onValueChange={setSelectionMethod}
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="template">By Template</TabsTrigger>
                    <TabsTrigger value="difficulty">By Difficulty</TabsTrigger>
                    <TabsTrigger value="manual">Manual Selection</TabsTrigger>
                  </TabsList>

                  <TabsContent value="template" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question-template">Select Template</Label>
                      <Select
                        value={selectedTemplate}
                        onValueChange={setSelectedTemplate}
                      >
                        <SelectTrigger id="question-template">
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">
                            Multiple Choice
                          </SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                          <SelectItem value="short-answer">
                            Short Answer
                          </SelectItem>
                          <SelectItem value="essay">Essay</SelectItem>
                          <SelectItem value="matching">Matching</SelectItem>
                          <SelectItem value="fill-blanks">
                            Fill in the Blanks
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedTemplate && (
                      <div className="space-y-4">
                        <div className="rounded-md border p-4">
                          <h3 className="font-medium">Available Questions</h3>
                          <div className="mt-2 space-y-2">
                            {mockQuestions
                              .filter((q) => q.type === selectedTemplate)
                              .map((question) => (
                                <div
                                  key={question.id}
                                  className="flex items-start space-x-2"
                                >
                                  <Checkbox
                                    id={`q-${question.id}`}
                                    checked={selectedQuestions.includes(
                                      question.id
                                    )}
                                    onCheckedChange={() =>
                                      handleSelectQuestion(question.id)
                                    }
                                  />
                                  <div>
                                    <Label
                                      htmlFor={`q-${question.id}`}
                                      className="font-normal"
                                    >
                                      {question.text}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                      {question.difficulty} • {question.points}{" "}
                                      points
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        <Button
                          onClick={handleAddSelectedQuestions}
                          disabled={selectedQuestions.length === 0}
                        >
                          Add Selected Questions
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="difficulty" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question-difficulty">
                        Select Difficulty
                      </Label>
                      <Select
                        value={selectedDifficulty}
                        onValueChange={setSelectedDifficulty}
                      >
                        <SelectTrigger id="question-difficulty">
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedDifficulty && (
                      <div className="space-y-4">
                        <div className="rounded-md border p-4">
                          <h3 className="font-medium">Available Questions</h3>
                          <div className="mt-2 space-y-2">
                            {mockQuestions
                              .filter(
                                (q) => q.difficulty === selectedDifficulty
                              )
                              .map((question) => (
                                <div
                                  key={question.id}
                                  className="flex items-start space-x-2"
                                >
                                  <Checkbox
                                    id={`q-${question.id}`}
                                    checked={selectedQuestions.includes(
                                      question.id
                                    )}
                                    onCheckedChange={() =>
                                      handleSelectQuestion(question.id)
                                    }
                                  />
                                  <div>
                                    <Label
                                      htmlFor={`q-${question.id}`}
                                      className="font-normal"
                                    >
                                      {question.text}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                      {question.type} • {question.points} points
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        <Button
                          onClick={handleAddSelectedQuestions}
                          disabled={selectedQuestions.length === 0}
                        >
                          Add Selected Questions
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="manual" className="space-y-4">
                    <div className="rounded-md border p-4">
                      <h3 className="font-medium">All Available Questions</h3>
                      <div className="mt-2 space-y-2">
                        {mockQuestions.map((question) => (
                          <div
                            key={question.id}
                            className="flex items-start space-x-2"
                          >
                            <Checkbox
                              id={`q-${question.id}`}
                              checked={selectedQuestions.includes(question.id)}
                              onCheckedChange={() =>
                                handleSelectQuestion(question.id)
                              }
                            />
                            <div>
                              <Label
                                htmlFor={`q-${question.id}`}
                                className="font-normal"
                              >
                                {question.text}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {question.type} • {question.difficulty} •{" "}
                                {question.points} points
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleAddSelectedQuestions}
                      disabled={selectedQuestions.length === 0}
                    >
                      Add Selected Questions
                    </Button>
                  </TabsContent>
                </Tabs>

                {/* Selected questions for the exam */}
                <div className="mt-8">
                  <h3 className="font-medium">Questions in this Exam</h3>
                  {exam.questions.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {exam.questions.map((questionId) => {
                        const question = mockQuestions.find(
                          (q) => q.id === questionId
                        );
                        if (!question) return null;

                        return (
                          <div
                            key={question.id}
                            className="flex items-start justify-between rounded-md border p-3"
                          >
                            <div>
                              <p className="font-medium">{question.text}</p>
                              <p className="text-xs text-muted-foreground">
                                {question.type} • {question.difficulty} •{" "}
                                {question.points} points
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveQuestion(question.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-4 flex h-24 items-center justify-center rounded-md border border-dashed">
                      <div className="text-center text-muted-foreground">
                        <FileText className="mx-auto h-8 w-8" />
                        <p className="mt-1">No questions added yet</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
