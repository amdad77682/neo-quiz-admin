"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/src/components/navbar";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useToast } from "@/src/components/ui/use-toast";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye,
} from "lucide-react";

// Mock questions data (in a real app, this would come from a database)
const mockQuestions = [
  {
    id: "1",
    text: "What is the capital of France?",
    type: "multiple-choice",
    category: "Geography",
    subcategory: "European Countries",
    difficulty: "easy",
    points: 1,
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    text: "The Earth is flat.",
    type: "true-false",
    category: "Science",
    subcategory: "Astronomy",
    difficulty: "easy",
    points: 1,
    createdAt: "2023-05-16",
  },
  {
    id: "3",
    text: "Explain the concept of object-oriented programming.",
    type: "essay",
    category: "Computer Science",
    subcategory: "Programming Paradigms",
    difficulty: "hard",
    points: 5,
    createdAt: "2023-05-17",
  },
  {
    id: "4",
    text: "What is the main function of the mitochondria in a cell?",
    type: "short-answer",
    category: "Biology",
    subcategory: "Cell Biology",
    difficulty: "medium",
    points: 2,
    createdAt: "2023-05-18",
  },
  {
    id: "5",
    text: "Match the following countries with their capitals.",
    type: "matching",
    category: "Geography",
    subcategory: "World Capitals",
    difficulty: "medium",
    points: 3,
    createdAt: "2023-05-19",
  },
  {
    id: "6",
    text: "The process of photosynthesis converts [blank] and [blank] into [blank] and [blank].",
    type: "fill-blanks",
    category: "Biology",
    subcategory: "Plant Biology",
    difficulty: "medium",
    points: 2,
    createdAt: "2023-05-20",
  },
  {
    id: "7",
    text: "What is the formula for calculating the area of a circle?",
    type: "multiple-choice",
    category: "Mathematics",
    subcategory: "Geometry",
    difficulty: "medium",
    points: 2,
    createdAt: "2023-05-21",
  },
  {
    id: "8",
    text: 'Who wrote the play "Romeo and Juliet"?',
    type: "short-answer",
    category: "Literature",
    subcategory: "Classic Literature",
    difficulty: "easy",
    points: 1,
    createdAt: "2023-05-22",
  },
];

export default function QuestionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState(mockQuestions);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

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

  // Apply filters
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? question.type === typeFilter : true;
    const matchesDifficulty = difficultyFilter
      ? question.difficulty === difficultyFilter
      : true;
    const matchesCategory = categoryFilter
      ? question.category === categoryFilter
      : true;

    return matchesSearch && matchesType && matchesDifficulty && matchesCategory;
  });

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    toast({
      title: "Question deleted",
      description: "The question has been successfully deleted.",
    });
  };

  const handleDuplicateQuestion = (id: string) => {
    const questionToDuplicate = questions.find((q) => q.id === id);
    if (questionToDuplicate) {
      const newQuestion = {
        ...questionToDuplicate,
        id: Date.now().toString(),
        text: `${questionToDuplicate.text} (Copy)`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setQuestions([...questions, newQuestion]);
      toast({
        title: "Question duplicated",
        description: "A copy of the question has been created.",
      });
    }
  };

  // Get unique categories and types for filters
  const categories = Array.from(new Set(questions.map((q) => q.category)));
  const types = Array.from(new Set(questions.map((q) => q.type)));

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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Questions</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your question bank
            </p>
          </div>
          <Button
            className="mt-4 sm:mt-0"
            onClick={() => router.push("/questions/create")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Question
          </Button>
        </div>

        {/* Filters and search */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Question Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Questions table */}
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">
                      <div className="line-clamp-2">{question.text}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {question.type
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="line-clamp-1">
                        {question.category}
                        <span className="text-xs text-muted-foreground block">
                          {question.subcategory}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          question.difficulty === "easy"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : question.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {question.difficulty.charAt(0).toUpperCase() +
                          question.difficulty.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{question.points}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/questions/view/${question.id}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/questions/edit/${question.id}`)
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicateQuestion(question.id)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No questions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
