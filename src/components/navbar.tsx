"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/components/ui/use-toast";

export function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUsername(user.username);
    }
  }, []);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("user");
    localStorage.removeItem("selectedTemplate");

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    router.push("/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/templates" className="text-xl font-bold text-primary">
            Neo Quiz
          </Link>
          <nav className="ml-8 hidden space-x-4 md:flex">
            <Link
              href="/templates"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              Templates
            </Link>
            <Link
              href="/questions"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              Questions
            </Link>
            <Link
              href="/exams"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              Exams
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {username && (
            <span className="hidden text-sm text-gray-700 md:inline-block">
              Welcome, {username}
            </span>
          )}
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
