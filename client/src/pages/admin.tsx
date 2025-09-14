import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Brain, 
  MapPin, 
  BarChart3,
  Home,
  CheckCircle,
  Target
} from "lucide-react";

// Form schemas
const recyclingRuleSchema = z.object({
  category: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  instructions: z.string().min(1, "Instructions are required"),
  whatGoesIn: z.string().min(1, "What goes in is required"),
  whatStaysOut: z.string().optional(),
  tips: z.string().optional(),
});

const quizQuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  options: z.string().min(1, "Options are required"),
  correctAnswer: z.number().min(0).max(3, "Correct answer must be 0-3"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  imageUrl: z.string().optional(),
});

const recyclingCenterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  zipCode: z.string().min(5, "Valid ZIP code is required"),
  phone: z.string().optional(),
  hours: z.string().min(1, "Hours are required"),
  acceptedTypes: z.string().min(1, "Accepted types are required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export default function Admin() {
  const [activeTab, setActiveTab] = useState("rules");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Queries
  const { data: rules = [], isLoading: rulesLoading } = useQuery<any[]>({
    queryKey: ['/api/recycling/rules'],
  });

  const { data: questions = [], isLoading: questionsLoading } = useQuery<any[]>({
    queryKey: ['/api/quiz/questions'],
  });

  const { data: centers = [], isLoading: centersLoading } = useQuery<any[]>({
    queryKey: ['/api/recycling/centers'],
  });

  const { data: leaderboard = [] } = useQuery<any[]>({
    queryKey: ['/api/leaderboard'],
  });

  // Mutations
  const createRuleMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/recycling/rules', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recycling/rules'] });
      toast({ title: "Success", description: "Rule created successfully" });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create rule", variant: "destructive" });
    },
  });

  const updateRuleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest('PATCH', `/api/recycling/rules/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recycling/rules'] });
      toast({ title: "Success", description: "Rule updated successfully" });
      setIsDialogOpen(false);
      setEditingItem(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update rule", variant: "destructive" });
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/recycling/rules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recycling/rules'] });
      toast({ title: "Success", description: "Rule deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete rule", variant: "destructive" });
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/quiz/questions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quiz/questions'] });
      toast({ title: "Success", description: "Question created successfully" });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create question", variant: "destructive" });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest('PATCH', `/api/quiz/questions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quiz/questions'] });
      toast({ title: "Success", description: "Question updated successfully" });
      setIsDialogOpen(false);
      setEditingItem(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update question", variant: "destructive" });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/quiz/questions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quiz/questions'] });
      toast({ title: "Success", description: "Question deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete question", variant: "destructive" });
    },
  });

  const createCenterMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/recycling/centers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recycling/centers'] });
      toast({ title: "Success", description: "Center created successfully" });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create center", variant: "destructive" });
    },
  });

  const updateCenterMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest('PATCH', `/api/recycling/centers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recycling/centers'] });
      toast({ title: "Success", description: "Center updated successfully" });
      setIsDialogOpen(false);
      setEditingItem(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update center", variant: "destructive" });
    },
  });

  const deleteCenterMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/recycling/centers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recycling/centers'] });
      toast({ title: "Success", description: "Center deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete center", variant: "destructive" });
    },
  });

  // Form handlers
  const RuleForm = ({ rule, onSubmit }: { rule?: any; onSubmit: (data: any) => void }) => {
    const form = useForm({
      resolver: zodResolver(recyclingRuleSchema),
      defaultValues: {
        category: rule?.category || "",
        title: rule?.title || "",
        description: rule?.description || "",
        instructions: rule?.instructions?.join(", ") || "",
        whatGoesIn: rule?.whatGoesIn?.join(", ") || "",
        whatStaysOut: rule?.whatStaysOut?.join(", ") || "",
        tips: rule?.tips?.join(", ") || "",
      },
    });

    const handleSubmit = (data: any) => {
      const formattedData = {
        ...data,
        instructions: data.instructions.split(",").map((s: string) => s.trim()),
        whatGoesIn: data.whatGoesIn.split(",").map((s: string) => s.trim()),
        whatStaysOut: data.whatStaysOut ? data.whatStaysOut.split(",").map((s: string) => s.trim()) : [],
        tips: data.tips ? data.tips.split(",").map((s: string) => s.trim()) : [],
      };
      onSubmit(formattedData);
    };

    return (
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={form.watch("category")} onValueChange={(value) => form.setValue("category", value)}>
            <SelectTrigger data-testid="select-rule-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plastic">Plastic</SelectItem>
              <SelectItem value="glass">Glass</SelectItem>
              <SelectItem value="organic">Organic</SelectItem>
              <SelectItem value="ewaste">E-waste</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input {...form.register("title")} data-testid="input-rule-title" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea {...form.register("description")} data-testid="textarea-rule-description" />
        </div>
        <div>
          <Label htmlFor="instructions">Instructions (comma separated)</Label>
          <Textarea {...form.register("instructions")} data-testid="textarea-rule-instructions" />
        </div>
        <div>
          <Label htmlFor="whatGoesIn">What Goes In (comma separated)</Label>
          <Textarea {...form.register("whatGoesIn")} data-testid="textarea-rule-goes-in" />
        </div>
        <div>
          <Label htmlFor="whatStaysOut">What Stays Out (comma separated, optional)</Label>
          <Textarea {...form.register("whatStaysOut")} data-testid="textarea-rule-stays-out" />
        </div>
        <div>
          <Label htmlFor="tips">Tips (comma separated, optional)</Label>
          <Textarea {...form.register("tips")} data-testid="textarea-rule-tips" />
        </div>
        <Button type="submit" data-testid="button-save-rule">
          {rule ? "Update" : "Create"} Rule
        </Button>
      </form>
    );
  };

  const QuestionForm = ({ question, onSubmit }: { question?: any; onSubmit: (data: any) => void }) => {
    const form = useForm({
      resolver: zodResolver(quizQuestionSchema),
      defaultValues: {
        question: question?.question || "",
        options: question?.options?.join(", ") || "",
        correctAnswer: question?.correctAnswer || 0,
        category: question?.category || "",
        difficulty: question?.difficulty || "easy",
        imageUrl: question?.imageUrl || "",
      },
    });

    const handleSubmit = (data: any) => {
      const formattedData = {
        ...data,
        options: data.options.split(",").map((s: string) => s.trim()),
      };
      onSubmit(formattedData);
    };

    return (
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="question">Question</Label>
          <Textarea {...form.register("question")} data-testid="textarea-question-text" />
        </div>
        <div>
          <Label htmlFor="options">Options (comma separated, exactly 4)</Label>
          <Textarea {...form.register("options")} data-testid="textarea-question-options" />
        </div>
        <div>
          <Label htmlFor="correctAnswer">Correct Answer (0-3)</Label>
          <Select value={form.watch("correctAnswer").toString()} onValueChange={(value) => form.setValue("correctAnswer", parseInt(value))}>
            <SelectTrigger data-testid="select-correct-answer">
              <SelectValue placeholder="Select correct answer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">A (First option)</SelectItem>
              <SelectItem value="1">B (Second option)</SelectItem>
              <SelectItem value="2">C (Third option)</SelectItem>
              <SelectItem value="3">D (Fourth option)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={form.watch("category")} onValueChange={(value) => form.setValue("category", value)}>
            <SelectTrigger data-testid="select-question-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plastic">Plastic</SelectItem>
              <SelectItem value="glass">Glass</SelectItem>
              <SelectItem value="organic">Organic</SelectItem>
              <SelectItem value="ewaste">E-waste</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={form.watch("difficulty")} onValueChange={(value) => form.setValue("difficulty", value)}>
            <SelectTrigger data-testid="select-question-difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL (optional)</Label>
          <Input {...form.register("imageUrl")} data-testid="input-question-image" />
        </div>
        <Button type="submit" data-testid="button-save-question">
          {question ? "Update" : "Create"} Question
        </Button>
      </form>
    );
  };

  const CenterForm = ({ center, onSubmit }: { center?: any; onSubmit: (data: any) => void }) => {
    const form = useForm({
      resolver: zodResolver(recyclingCenterSchema),
      defaultValues: {
        name: center?.name || "",
        address: center?.address || "",
        zipCode: center?.zipCode || "",
        phone: center?.phone || "",
        hours: center?.hours || "",
        acceptedTypes: center?.acceptedTypes?.join(", ") || "",
        latitude: center?.latitude || "",
        longitude: center?.longitude || "",
      },
    });

    const handleSubmit = (data: any) => {
      const formattedData = {
        ...data,
        acceptedTypes: data.acceptedTypes.split(",").map((s: string) => s.trim()),
      };
      onSubmit(formattedData);
    };

    return (
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input {...form.register("name")} data-testid="input-center-name" />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea {...form.register("address")} data-testid="textarea-center-address" />
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input {...form.register("zipCode")} data-testid="input-center-zip" />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input {...form.register("phone")} data-testid="input-center-phone" />
        </div>
        <div>
          <Label htmlFor="hours">Hours</Label>
          <Input {...form.register("hours")} data-testid="input-center-hours" />
        </div>
        <div>
          <Label htmlFor="acceptedTypes">Accepted Types (comma separated)</Label>
          <Textarea {...form.register("acceptedTypes")} data-testid="textarea-center-types" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude (optional)</Label>
            <Input {...form.register("latitude")} data-testid="input-center-lat" />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude (optional)</Label>
            <Input {...form.register("longitude")} data-testid="input-center-lng" />
          </div>
        </div>
        <Button type="submit" data-testid="button-save-center">
          {center ? "Update" : "Create"} Center
        </Button>
      </form>
    );
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'plastic': return 'bg-blue-100 text-blue-800';
      case 'glass': return 'bg-green-100 text-green-800';
      case 'organic': return 'bg-amber-100 text-amber-800';
      case 'ewaste': return 'bg-purple-100 text-purple-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-4xl mb-2" data-testid="text-page-title">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage recycling content and system data
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2" data-testid="button-back-to-app">
              <Home className="w-4 h-4" />
              Back to home
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rules" data-testid="tab-rules">Recycling Rules</TabsTrigger>
            <TabsTrigger value="quiz" data-testid="tab-quiz">Quiz Management</TabsTrigger>
            <TabsTrigger value="locations" data-testid="tab-locations">Locations</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Rules Management Tab */}
          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recycling Rules Management</CardTitle>
                  <Dialog open={isDialogOpen && activeTab === 'rules'} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-rule">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Rule
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit' : 'Add'} Recycling Rule</DialogTitle>
                      </DialogHeader>
                      <RuleForm
                        rule={editingItem}
                        onSubmit={(data) => {
                          if (editingItem) {
                            updateRuleMutation.mutate({ id: editingItem.id, data });
                          } else {
                            createRuleMutation.mutate(data);
                          }
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {rulesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading rules...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rules.map((rule: any) => (
                      <div key={rule.id} className="border border-border rounded-lg p-4" data-testid={`card-rule-${rule.id}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2" data-testid={`text-rule-title-${rule.id}`}>
                              {rule.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3" data-testid={`text-rule-description-${rule.id}`}>
                              {rule.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                              <Badge className={getCategoryBadgeColor(rule.category)} data-testid={`badge-rule-category-${rule.id}`}>
                                {rule.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingItem(rule);
                                setIsDialogOpen(true);
                              }}
                              data-testid={`button-edit-rule-${rule.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this rule?')) {
                                  deleteRuleMutation.mutate(rule.id);
                                }
                              }}
                              data-testid={`button-delete-rule-${rule.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Management Tab */}
          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quiz Questions Management</CardTitle>
                  <Dialog open={isDialogOpen && activeTab === 'quiz'} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-question">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Question
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit' : 'Add'} Quiz Question</DialogTitle>
                      </DialogHeader>
                      <QuestionForm
                        question={editingItem}
                        onSubmit={(data) => {
                          if (editingItem) {
                            updateQuestionMutation.mutate({ id: editingItem.id, data });
                          } else {
                            createQuestionMutation.mutate(data);
                          }
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {questionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading questions...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question: any) => (
                      <div key={question.id} className="border border-border rounded-lg p-4" data-testid={`card-question-${question.id}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2" data-testid={`text-question-text-${question.id}`}>
                              {question.question}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3">
                              {question.options?.map((option: string, index: number) => 
                                `${String.fromCharCode(65 + index)}) ${option}`
                              ).join("  ")}
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                              <Badge className="bg-success/10 text-success" data-testid={`badge-correct-answer-${question.id}`}>
                                Correct: {String.fromCharCode(65 + question.correctAnswer)}
                              </Badge>
                              <Badge className={getCategoryBadgeColor(question.category)} data-testid={`badge-question-category-${question.id}`}>
                                {question.category}
                              </Badge>
                              <span className="text-muted-foreground">Difficulty: {question.difficulty}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingItem(question);
                                setIsDialogOpen(true);
                              }}
                              data-testid={`button-edit-question-${question.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this question?')) {
                                  deleteQuestionMutation.mutate(question.id);
                                }
                              }}
                              data-testid={`button-delete-question-${question.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Management Tab */}
          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recycling Locations Management</CardTitle>
                  <Dialog open={isDialogOpen && activeTab === 'locations'} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Location
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit' : 'Add'} Recycling Center</DialogTitle>
                      </DialogHeader>
                      <CenterForm
                        center={editingItem}
                        onSubmit={(data) => {
                          if (editingItem) {
                            updateCenterMutation.mutate({ id: editingItem.id, data });
                          } else {
                            createCenterMutation.mutate(data);
                          }
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {centersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading centers...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {centers.map((center: any) => (
                      <div key={center.id} className="border border-border rounded-lg p-4" data-testid={`card-center-${center.id}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2" data-testid={`text-center-name-${center.id}`}>
                              {center.name}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3" data-testid={`text-center-address-${center.id}`}>
                              {center.address}
                            </p>
                            <div className="flex items-center space-x-4 text-sm mb-3">
                              <span className="text-muted-foreground">{center.hours}</span>
                              {center.phone && <span className="text-muted-foreground">Phone: {center.phone}</span>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {center.acceptedTypes?.map((type: string, index: number) => (
                                <Badge key={index} className={getCategoryBadgeColor(type.toLowerCase())} data-testid={`badge-center-type-${center.id}-${index}`}>
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingItem(center);
                                setIsDialogOpen(true);
                              }}
                              data-testid={`button-edit-center-${center.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this center?')) {
                                  deleteCenterMutation.mutate(center.id);
                                }
                              }}
                              data-testid={`button-delete-center-${center.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold text-2xl text-primary" data-testid="text-stat-total-users">
                        {leaderboard.length}
                      </h3>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <Brain className="w-8 h-8 text-success mx-auto mb-2" />
                      <h3 className="font-semibold text-2xl text-success" data-testid="text-stat-total-questions">
                        {questions.length}
                      </h3>
                      <p className="text-sm text-muted-foreground">Quiz Questions</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-accent mx-auto mb-2" />
                      <h3 className="font-semibold text-2xl text-accent" data-testid="text-stat-total-quizzes">
                        {leaderboard.reduce((sum: number, user: any) => sum + (user.quizzesCompleted || 0), 0)}
                      </h3>
                      <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <MapPin className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <h3 className="font-semibold text-2xl text-secondary" data-testid="text-stat-total-centers">
                        {centers.length}
                      </h3>
                      <p className="text-sm text-muted-foreground">Active Locations</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-muted rounded-lg p-6">
                      <h3 className="font-semibold mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Top Performers
                      </h3>
                      <div className="space-y-3">
                        {leaderboard.slice(0, 5).map((user: any, index: number) => (
                          <div key={user.id} className="flex items-center justify-between" data-testid={`row-top-user-${index}`}>
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                index === 1 ? 'bg-gray-100 text-gray-800' :
                                index === 2 ? 'bg-amber-100 text-amber-800' : 'bg-muted'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="font-medium" data-testid={`text-top-user-name-${index}`}>
                                {user.username}
                              </span>
                            </div>
                            <span className="font-bold" data-testid={`text-top-user-score-${index}`}>
                              {user.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-6">
                      <h3 className="font-semibold mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Category Distribution
                      </h3>
                      <div className="space-y-3">
                        {['plastic', 'glass', 'organic', 'ewaste'].map((category) => {
                          const categoryQuestions = questions.filter((q: any) => q.category === category).length;
                          const percentage = questions.length > 0 ? Math.round((categoryQuestions / questions.length) * 100) : 0;
                          return (
                            <div key={category} className="space-y-1" data-testid={`row-category-${category}`}>
                              <div className="flex justify-between text-sm">
                                <span className="capitalize">{category}</span>
                                <span>{percentage}%</span>
                              </div>
                              <div className="w-full bg-background rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    category === 'plastic' ? 'bg-blue-500' :
                                    category === 'glass' ? 'bg-green-500' :
                                    category === 'organic' ? 'bg-amber-500' : 'bg-purple-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
