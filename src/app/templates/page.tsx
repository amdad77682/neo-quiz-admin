"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/components/ui/use-toast";
import { Navbar } from "@/src/components/navbar";

// Template types
const templates = [
  {
    id: "multiple-choice",
    title: "Multiple Choice",
    description:
      "Questions with multiple options where one or more can be correct",
    icon: "📝",
  },
  {
    id: "true-false",
    title: "True/False",
    description: "Simple questions with True or False answers",
    icon: "✓✗",
  },
  {
    id: "short-answer",
    title: "Short Answer",
    description: "Questions that require a brief text response",
    icon: "📄",
  },
  {
    id: "essay",
    title: "Essay",
    description: "Questions that require a detailed written response",
    icon: "📑",
  },
  {
    id: "matching",
    title: "Matching",
    description: "Match items from two different columns",
    icon: "🔄",
  },
  {
    id: "fill-blanks",
    title: "Fill in the Blanks",
    description: "Complete sentences by filling in missing words",
    icon: "___",
  },
];

export default function TemplatesPage() {
  const [isLoading, setIsLoading] = useState(true);
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

  const handleSelectTemplate = (templateId: string) => {
    // Store selected template
    localStorage.setItem("selectedTemplate", templateId);
    router.push("/questions/create");
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Select a Quiz Template</h1>
          <p className="mt-2 text-muted-foreground">
            Choose a template to start creating your questions
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="mb-2 text-4xl">{template.icon}</div>
                <CardTitle>{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button
                  className="w-full"
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  Select Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
