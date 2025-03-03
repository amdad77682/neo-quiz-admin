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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
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
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye,
  Clock,
  FileText,
  Calendar,
} from "lucide-react";

// Mock exams data (in a real app, this would come from a database)
const mockExams = [
  {
    id: "1",
    title: "Geography Quiz - Europe",
    description: "Test your knowledge of European geography",
    category: "Geography",
    questionCount: 10,
    duration: 30, // minutes
    passingScore: 70,
    createdAt: "2023-06-15",
    status: "published",
  },
  {
    id: "2",
    title: "Biology Midterm",
    description: "Comprehensive test covering cell biology and genetics",
    category: "Biology",
    questionCount: 25,
    duration: 60,
    passingScore: 65,
    createdAt: "2023-06-18",
    status: "draft",
  },
  {
    id: "3",
    title: "Programming Fundamentals",
    description: "Basic concepts of programming and algorithms",
    category: "Computer Science",
    questionCount: 15,
    duration: 45,
    passingScore: 60,
    createdAt: "2023-06-20",
    status: "published",
  },
  {
    id: "4",
    title: "World History - Ancient Civilizations",
    description: "Explore the ancient civilizations of Egypt, Greece, and Rome",
    category: "History",
    questionCount: 20,
    duration: 50,
    passingScore: 75,
    createdAt: "2023-06-22",
    status: "published",
  },
  {
    id: "5",
    title: "Mathematics - Algebra",
    description: "Test your algebra skills with equations and functions",
    category: "Mathematics",
    questionCount: 12,
    duration: 40,
    passingScore: 70,
    createdAt: "2023-06-25",
    status: "draft",
  },
];

export default function ExamsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [exams, setExams] = useState(mockExams);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : exam.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteExam = (id: string) => {
    setExams(exams.filter((e) => e.id !== id));
    toast({
      title: "Exam deleted",
      description: "The exam has been successfully deleted.",
    });
  };

  const handleDuplicateExam = (id: string) => {
    const examToDuplicate = exams.find((e) => e.id === id);
    if (examToDuplicate) {
      const newExam = {
        ...examToDuplicate,
        id: Date.now().toString(),
        title: `${examToDuplicate.title} (Copy)`,
        status: "draft",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setExams([...exams, newExam]);
      toast({
        title: "Exam duplicated",
        description: "A copy of the exam has been created as a draft.",
      });
    }
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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Exams</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your quizzes and exams
            </p>
          </div>
          <Button
            className="mt-4 sm:mt-0"
            onClick={() => router.push("/exams/create")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </Button>
        </div>

        {/* Filters and search */}
        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exams..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "published" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("published")}
            >
              Published
            </Button>
            <Button
              variant={statusFilter === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("draft")}
            >
              Drafts
            </Button>
          </div>
        </div>

        {/* Exams grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <Card key={exam.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-1">{exam.title}</CardTitle>
                    <Badge
                      variant={
                        exam.status === "published" ? "default" : "outline"
                      }
                    >
                      {exam.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {exam.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <FileText className="mr-2 h-4 w-4" />
                      {exam.questionCount} questions
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {exam.duration} minutes
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Created on {exam.createdAt}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/exams/view/${exam.id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/exams/edit/${exam.id}`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicateExam(exam.id)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteExam(exam.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
              <div className="text-center text-muted-foreground">
                <FileText className="mx-auto h-8 w-8" />
                <p className="mt-1">No exams found</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => router.push("/exams/create")}
                >
                  Create your first exam
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
