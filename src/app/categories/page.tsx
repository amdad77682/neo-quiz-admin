"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Label } from "@/src/components/ui/label";
import { useToast } from "@/src/components/ui/use-toast";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  FolderPlus,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// Mock categories data (in a real app, this would come from a database)
const mockCategories = [
  {
    id: "1",
    name: "Mathematics",
    description: "Questions related to mathematics",
    questionCount: 25,
    subcategories: [
      {
        id: "1-1",
        name: "Algebra",
        description: "Algebraic equations and expressions",
        questionCount: 10,
      },
      {
        id: "1-2",
        name: "Geometry",
        description: "Shapes, areas, and volumes",
        questionCount: 8,
      },
      {
        id: "1-3",
        name: "Calculus",
        description: "Differentiation and integration",
        questionCount: 7,
      },
    ],
  },
  {
    id: "2",
    name: "Science",
    description: "Scientific concepts and knowledge",
    questionCount: 40,
    subcategories: [
      {
        id: "2-1",
        name: "Physics",
        description: "Laws of physics and mechanics",
        questionCount: 15,
      },
      {
        id: "2-2",
        name: "Chemistry",
        description: "Chemical elements and reactions",
        questionCount: 12,
      },
      {
        id: "2-3",
        name: "Biology",
        description: "Living organisms and systems",
        questionCount: 13,
      },
    ],
  },
  {
    id: "3",
    name: "History",
    description: "Historical events and figures",
    questionCount: 30,
    subcategories: [
      {
        id: "3-1",
        name: "Ancient History",
        description: "Early civilizations",
        questionCount: 10,
      },
      {
        id: "3-2",
        name: "Modern History",
        description: "Recent centuries",
        questionCount: 12,
      },
      {
        id: "3-3",
        name: "World Wars",
        description: "WWI and WWII",
        questionCount: 8,
      },
    ],
  },
  {
    id: "4",
    name: "Literature",
    description: "Books, authors, and literary concepts",
    questionCount: 20,
    subcategories: [
      {
        id: "4-1",
        name: "Classic Literature",
        description: "Timeless literary works",
        questionCount: 8,
      },
      {
        id: "4-2",
        name: "Modern Literature",
        description: "Contemporary authors and works",
        questionCount: 7,
      },
      {
        id: "4-3",
        name: "Poetry",
        description: "Poetic forms and famous poems",
        questionCount: 5,
      },
    ],
  },
  {
    id: "5",
    name: "Geography",
    description: "Countries, capitals, and geographical features",
    questionCount: 18,
    subcategories: [
      {
        id: "5-1",
        name: "World Geography",
        description: "Global geographical features",
        questionCount: 10,
      },
      {
        id: "5-2",
        name: "Physical Geography",
        description: "Landforms and natural features",
        questionCount: 8,
      },
    ],
  },
];

export default function CategoriesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newSubcategory, setNewSubcategory] = useState({
    parentId: "",
    name: "",
    description: "",
  });
  const [editCategory, setEditCategory] = useState<any>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);

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

  // Apply search filter
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Also check subcategories
    const hasMatchingSubcategory = category.subcategories.some(
      (sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return matchesSearch || hasMatchingSubcategory;
  });

  const toggleCategoryExpansion = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(
        expandedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Name required",
        description: "Please enter a name for the category.",
        variant: "destructive",
      });
      return;
    }

    const newCategoryObj = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
      questionCount: 0,
      subcategories: [],
    };

    setCategories([...categories, newCategoryObj]);
    setNewCategory({ name: "", description: "" });
    setIsAddCategoryOpen(false);

    toast({
      title: "Category added",
      description: "The category has been successfully created.",
    });
  };

  const handleAddSubcategory = () => {
    if (!newSubcategory.name || !newSubcategory.parentId) {
      toast({
        title: "Information required",
        description: "Please enter a name and select a parent category.",
        variant: "destructive",
      });
      return;
    }

    const newSubcategoryObj = {
      id: `${newSubcategory.parentId}-${Date.now()}`,
      name: newSubcategory.name,
      description: newSubcategory.description,
      questionCount: 0,
    };

    const updatedCategories = categories.map((category) => {
      if (category.id === newSubcategory.parentId) {
        return {
          ...category,
          subcategories: [...category.subcategories, newSubcategoryObj],
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    setNewSubcategory({ parentId: "", name: "", description: "" });
    setIsAddSubcategoryOpen(false);

    // Make sure the parent category is expanded
    if (!expandedCategories.includes(newSubcategory.parentId)) {
      setExpandedCategories([...expandedCategories, newSubcategory.parentId]);
    }

    toast({
      title: "Subcategory added",
      description: "The subcategory has been successfully created.",
    });
  };

  const handleEditCategory = () => {
    if (!editCategory || !editCategory.name) {
      toast({
        title: "Name required",
        description: "Please enter a name for the category.",
        variant: "destructive",
      });
      return;
    }

    let updatedCategories;

    // Check if it's a subcategory
    if (editCategory.parentId) {
      updatedCategories = categories.map((category) => {
        if (category.id === editCategory.parentId) {
          return {
            ...category,
            subcategories: category.subcategories.map((sub) =>
              sub.id === editCategory.id
                ? {
                    ...sub,
                    name: editCategory.name,
                    description: editCategory.description,
                  }
                : sub
            ),
          };
        }
        return category;
      });
    } else {
      // It's a main category
      updatedCategories = categories.map((category) =>
        category.id === editCategory.id
          ? {
              ...category,
              name: editCategory.name,
              description: editCategory.description,
            }
          : category
      );
    }

    setCategories(updatedCategories);
    setEditCategory(null);
    setIsEditCategoryOpen(false);

    toast({
      title: "Category updated",
      description: "The category has been successfully updated.",
    });
  };

  const handleDeleteCategory = (categoryId: string, parentId?: string) => {
    if (parentId) {
      // Delete subcategory
      const updatedCategories = categories.map((category) => {
        if (category.id === parentId) {
          return {
            ...category,
            subcategories: category.subcategories.filter(
              (sub) => sub.id !== categoryId
            ),
          };
        }
        return category;
      });
      setCategories(updatedCategories);
    } else {
      // Delete main category
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
    }

    toast({
      title: "Category deleted",
      description: "The category has been successfully deleted.",
    });
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
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="mt-2 text-muted-foreground">
              Organize your questions with categories and subcategories
            </p>
          </div>
          <div className="mt-4 flex space-x-2 sm:mt-0">
            <Dialog
              open={isAddSubcategoryOpen}
              onOpenChange={setIsAddSubcategoryOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Add Subcategory
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Subcategory</DialogTitle>
                  <DialogDescription>
                    Create a new subcategory under an existing category.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent-category">Parent Category</Label>
                    <select
                      id="parent-category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newSubcategory.parentId}
                      onChange={(e) =>
                        setNewSubcategory({
                          ...newSubcategory,
                          parentId: e.target.value,
                        })
                      }
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subcategory-name">Name</Label>
                    <Input
                      id="subcategory-name"
                      value={newSubcategory.name}
                      onChange={(e) =>
                        setNewSubcategory({
                          ...newSubcategory,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subcategory-description">
                      Description (Optional)
                    </Label>
                    <Input
                      id="subcategory-description"
                      value={newSubcategory.description}
                      onChange={(e) =>
                        setNewSubcategory({
                          ...newSubcategory,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddSubcategoryOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddSubcategory}>
                    Add Subcategory
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isAddCategoryOpen}
              onOpenChange={setIsAddCategoryOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Category</DialogTitle>
                  <DialogDescription>
                    Create a new category to organize your questions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Name</Label>
                    <Input
                      id="category-name"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-description">
                      Description (Optional)
                    </Label>
                    <Input
                      id="category-description"
                      value={newCategory.description}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddCategoryOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories and subcategories..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories table */}
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Name</TableHead>
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <>
                    <TableRow key={category.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <button
                          className="flex items-center"
                          onClick={() => toggleCategoryExpansion(category.id)}
                        >
                          {expandedCategories.includes(category.id) ? (
                            <ChevronDown className="mr-2 h-4 w-4" />
                          ) : (
                            <ChevronRight className="mr-2 h-4 w-4" />
                          )}
                          {category.name}
                        </button>
                      </TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>{category.questionCount}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditCategory({
                                  id: category.id,
                                  name: category.name,
                                  description: category.description,
                                });
                                setIsEditCategoryOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    {/* Subcategories */}
                    {expandedCategories.includes(category.id) &&
                      category.subcategories.map((subcategory) => (
                        <TableRow key={subcategory.id} className="bg-muted/30">
                          <TableCell className="font-medium pl-10">
                            {subcategory.name}
                          </TableCell>
                          <TableCell>{subcategory.description}</TableCell>
                          <TableCell>{subcategory.questionCount}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditCategory({
                                      id: subcategory.id,
                                      parentId: category.id,
                                      name: subcategory.name,
                                      description: subcategory.description,
                                    });
                                    setIsEditCategoryOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() =>
                                    handleDeleteCategory(
                                      subcategory.id,
                                      category.id
                                    )
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Category Dialog */}
        <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Edit {editCategory?.parentId ? "Subcategory" : "Category"}
              </DialogTitle>
              <DialogDescription>
                Update the {editCategory?.parentId ? "subcategory" : "category"}{" "}
                information.
              </DialogDescription>
            </DialogHeader>
            {editCategory && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editCategory.name}
                    onChange={(e) =>
                      setEditCategory({ ...editCategory, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">
                    Description (Optional)
                  </Label>
                  <Input
                    id="edit-description"
                    value={editCategory.description}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditCategoryOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditCategory}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
