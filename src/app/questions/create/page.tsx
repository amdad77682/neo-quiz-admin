"use client";

import { useEffect, useState, useRef } from "react";
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
import { useToast } from "@/src/components/ui/use-toast";
import { PlusCircle, Trash2, GripVertical } from "lucide-react";

export default function CreateQuestionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [question, setQuestion] = useState({
    text: "",
    difficulty: "medium",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    explanation: "",
    points: 1,
  });

  const router = useRouter();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }

    // Get selected template
    const template = localStorage.getItem("selectedTemplate");
    if (!template) {
      router.push("/templates");
      return;
    }

    setTemplateId(template);

    // Set template name
    switch (template) {
      case "multiple-choice":
        setTemplateName("Multiple Choice");
        break;
      case "true-false":
        setTemplateName("True/False");
        setQuestion((prev) => ({
          ...prev,
          options: [
            { text: "True", isCorrect: false },
            { text: "False", isCorrect: false },
          ],
        }));
        break;
      case "short-answer":
        setTemplateName("Short Answer");
        setQuestion((prev) => ({ ...prev, options: [] }));
        break;
      case "essay":
        setTemplateName("Essay");
        setQuestion((prev) => ({ ...prev, options: [] }));
        break;
      case "matching":
        setTemplateName("Matching");
        setQuestion((prev) => ({
          ...prev,
          options: [
            { text: "Item 1", isCorrect: false, match: "Match 1" },
            { text: "Item 2", isCorrect: false, match: "Match 2" },
          ],
        }));
        break;
      case "fill-blanks":
        setTemplateName("Fill in the Blanks");
        setQuestion((prev) => ({ ...prev, options: [] }));
        break;
      default:
        setTemplateName("Custom Template");
    }

    setIsLoading(false);
  }, [router]);

  // Handle mouse events for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Limit the minimum and maximum width
      if (newLeftWidth >= 30 && newLeftWidth <= 70) {
        setLeftPanelWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], text: value };
    setQuestion({ ...question, options: newOptions });
  };

  const handleCorrectChange = (index: number) => {
    const newOptions = [...question.options];

    // For multiple choice, toggle the selected option
    if (templateId === "multiple-choice") {
      newOptions[index] = {
        ...newOptions[index],
        isCorrect: !newOptions[index].isCorrect,
      };
    }
    // For true/false, make the selected option correct and others incorrect
    else if (templateId === "true-false") {
      newOptions.forEach((option, i) => {
        newOptions[i] = { ...option, isCorrect: i === index };
      });
    }

    setQuestion({ ...question, options: newOptions });
  };

  const addOption = () => {
    setQuestion({
      ...question,
      options: [...question.options, { text: "", isCorrect: false }],
    });
  };

  const removeOption = (index: number) => {
    if (question.options.length <= 2) {
      toast({
        title: "Cannot remove option",
        description: "You need at least two options for this question type.",
        variant: "destructive",
      });
      return;
    }

    const newOptions = [...question.options];
    newOptions.splice(index, 1);
    setQuestion({ ...question, options: newOptions });
  };

  const handleSaveQuestion = () => {
    // Validate question
    if (!question.text.trim()) {
      toast({
        title: "Missing question text",
        description: "Please enter the question text.",
        variant: "destructive",
      });
      return;
    }

    // Validate options for multiple choice and true/false
    if (["multiple-choice", "true-false"].includes(templateId || "")) {
      // Check if any option is empty
      if (question.options.some((opt) => !opt.text.trim())) {
        toast({
          title: "Empty option",
          description: "Please fill in all options.",
          variant: "destructive",
        });
        return;
      }

      // Check if at least one option is marked as correct
      if (!question.options.some((opt) => opt.isCorrect)) {
        toast({
          title: "No correct answer",
          description: "Please mark at least one option as correct.",
          variant: "destructive",
        });
        return;
      }
    }

    // In a real app, you would save the question to a database
    // For this demo, we'll just show a success message
    toast({
      title: "Question saved",
      description: "Your question has been saved successfully.",
    });

    // Clear the form or redirect
    router.push("/exams/create");
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
          <h1 className="text-3xl font-bold">Create {templateName} Question</h1>
          <p className="mt-2 text-muted-foreground">
            Design your question and preview how it will appear to users
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative flex min-h-[600px] overflow-hidden rounded-lg bg-white shadow"
        >
          {/* Left panel - Question Editor */}
          <div
            className="overflow-y-auto p-6"
            style={{ width: `${leftPanelWidth}%` }}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question-text">Question Text</Label>
                <Textarea
                  id="question-text"
                  placeholder="Enter your question here..."
                  className="min-h-[100px]"
                  value={question.text}
                  onChange={(e) =>
                    setQuestion({ ...question, text: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={question.difficulty}
                  onValueChange={(value) =>
                    setQuestion({ ...question, difficulty: value })
                  }
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  value={question.points}
                  onChange={(e) =>
                    setQuestion({
                      ...question,
                      points: Number.parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              {/* Options section - only for multiple choice and true/false */}
              {["multiple-choice", "true-false"].includes(templateId || "") && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Answer Options</Label>
                    {templateId === "multiple-choice" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addOption}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Option
                      </Button>
                    )}
                  </div>

                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type={
                              templateId === "multiple-choice"
                                ? "checkbox"
                                : "radio"
                            }
                            id={`option-${index}`}
                            name="correct-option"
                            checked={option.isCorrect}
                            onChange={() => handleCorrectChange(index)}
                            className="h-4 w-4"
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className="text-sm font-normal"
                          >
                            Correct
                          </Label>
                        </div>
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option.text}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          disabled={templateId === "true-false"}
                        />
                      </div>
                      {templateId === "multiple-choice" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Short answer section */}
              {templateId === "short-answer" && (
                <div className="space-y-2">
                  <Label htmlFor="correct-answer">Correct Answer</Label>
                  <Input
                    id="correct-answer"
                    placeholder="Enter the correct answer"
                    value={question.correctAnswer || ""}
                    onChange={(e) =>
                      setQuestion({
                        ...question,
                        correctAnswer: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {/* Essay section */}
              {templateId === "essay" && (
                <div className="space-y-2">
                  <Label htmlFor="answer-guidelines">Answer Guidelines</Label>
                  <Textarea
                    id="answer-guidelines"
                    placeholder="Enter guidelines for essay answers..."
                    className="min-h-[100px]"
                    value={question.guidelines || ""}
                    onChange={(e) =>
                      setQuestion({ ...question, guidelines: e.target.value })
                    }
                  />
                </div>
              )}

              {/* Matching section */}
              {templateId === "matching" && (
                <div className="space-y-4">
                  <Label>Matching Pairs</Label>
                  {question.options.map((option, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder={`Item ${index + 1}`}
                        value={option.text}
                        onChange={(e) => {
                          const newOptions = [...question.options];
                          newOptions[index] = {
                            ...newOptions[index],
                            text: e.target.value,
                          };
                          setQuestion({ ...question, options: newOptions });
                        }}
                      />
                      <Input
                        placeholder={`Match ${index + 1}`}
                        value={option.match || ""}
                        onChange={(e) => {
                          const newOptions = [...question.options];
                          newOptions[index] = {
                            ...newOptions[index],
                            match: e.target.value,
                          };
                          setQuestion({ ...question, options: newOptions });
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Pair
                  </Button>
                </div>
              )}

              {/* Fill in the blanks section */}
              {templateId === "fill-blanks" && (
                <div className="space-y-2">
                  <Label htmlFor="blanks-instruction">Instructions</Label>
                  <p className="text-sm text-muted-foreground">
                    Use [blank] in your question text to indicate where blanks
                    should appear.
                  </p>
                  <div className="space-y-4 mt-4">
                    <Label>Answers for Blanks</Label>
                    <div className="space-y-2">
                      {(question.text.match(/\[blank\]/g) || []).map(
                        (_, index) => (
                          <Input
                            key={index}
                            placeholder={`Answer for blank ${index + 1}`}
                            value={question.blankAnswers?.[index] || ""}
                            onChange={(e) => {
                              const newBlankAnswers = [
                                ...(question.blankAnswers || []),
                              ];
                              newBlankAnswers[index] = e.target.value;
                              setQuestion({
                                ...question,
                                blankAnswers: newBlankAnswers,
                              });
                            }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea
                  id="explanation"
                  placeholder="Explain the correct answer..."
                  className="min-h-[100px]"
                  value={question.explanation}
                  onChange={(e) =>
                    setQuestion({ ...question, explanation: e.target.value })
                  }
                />
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={handleSaveQuestion}
              >
                Save Question
              </Button>
            </div>
          </div>

          {/* Drag handle */}
          <div
            ref={dragHandleRef}
            className="absolute inset-y-0 flex cursor-col-resize items-center justify-center bg-gray-200 hover:bg-gray-300"
            style={{ left: `${leftPanelWidth}%`, width: "10px" }}
            onMouseDown={handleMouseDown}
          >
            <GripVertical className="h-6 w-6 text-gray-500" />
          </div>

          {/* Right panel - Question Preview */}
          <div
            className="overflow-y-auto p-6"
            style={{ width: `${100 - leftPanelWidth}%` }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Question Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {question.text ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">
                        {question.text.replace(/\[blank\]/g, "________")}
                      </h3>
                      <div className="mt-1 flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            question.difficulty === "easy"
                              ? "bg-green-100 text-green-800"
                              : question.difficulty === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {question.difficulty.charAt(0).toUpperCase() +
                            question.difficulty.slice(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {question.points}{" "}
                          {question.points === 1 ? "point" : "points"}
                        </span>
                      </div>
                    </div>

                    {/* Preview for multiple choice and true/false */}
                    {["multiple-choice", "true-false"].includes(
                      templateId || ""
                    ) && (
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type={
                                templateId === "multiple-choice"
                                  ? "checkbox"
                                  : "radio"
                              }
                              id={`preview-option-${index}`}
                              disabled
                              className="h-4 w-4"
                            />
                            <Label
                              htmlFor={`preview-option-${index}`}
                              className="text-sm font-normal"
                            >
                              {option.text}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Preview for short answer */}
                    {templateId === "short-answer" && (
                      <div className="space-y-2">
                        <Input disabled placeholder="Enter your answer" />
                      </div>
                    )}

                    {/* Preview for essay */}
                    {templateId === "essay" && (
                      <div className="space-y-2">
                        <Textarea
                          disabled
                          placeholder="Write your essay here..."
                          className="min-h-[150px]"
                        />
                        {question.guidelines && (
                          <div className="rounded-md bg-blue-50 p-4">
                            <p className="text-sm text-blue-700">
                              <strong>Guidelines:</strong> {question.guidelines}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Preview for matching */}
                    {templateId === "matching" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="font-medium">Items</p>
                            {question.options.map((option, index) => (
                              <div
                                key={index}
                                className="rounded-md border p-2"
                              >
                                {option.text || `Item ${index + 1}`}
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <p className="font-medium">Matches</p>
                            {question.options.map((option, index) => (
                              <div
                                key={index}
                                className="rounded-md border p-2"
                              >
                                {option.match || `Match ${index + 1}`}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preview for fill in the blanks */}
                    {templateId === "fill-blanks" && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Fill in each blank with the correct answer.
                        </p>
                        <div>
                          {question.text
                            .split(/\[blank\]/)
                            .map((part, index, array) => (
                              <span key={index}>
                                {part}
                                {index < array.length - 1 && (
                                  <Input
                                    className="mx-1 inline-block w-32"
                                    disabled
                                    placeholder="________"
                                  />
                                )}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center text-muted-foreground">
                    <p>Question preview will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
