/* eslint-disable react/no-unescaped-entities */
"use client";

import type React from "react";
import { useAuth } from "@/hooks/use-auth";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  Briefcase,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  LineChart,
  ListChecks,
  MessageSquareText,
  PieChart,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  TrendingUp,
  User,
  X,
  Send,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { fetchAIResponse } from "@/lib/ai-service";
import { Input } from "@/components/ui/input";
import { SessionUser } from "@/types";

// Add this interface at the top of the file, before the component definition
interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface SkillData {
  name: string;
  value: number;
}


interface DashboardPageProps {
  user: any; // Ideally replace `any` with your actual `User` type
}

export default function DashboardPage({ user }: DashboardPageProps) {
  const { user: authUser, setUser } = useAuth();

  // Hydrate the context with server-side user on initial mount
  useEffect(() => {
    if (user && !authUser) {
      setUser(user);
    }
  }, [user, authUser, setUser]);

  const [activeTab, setActiveTab] = useState("overview");
  const [aiRecommendations, setAiRecommendations] = useState<{
    careerMatch: string;
    matchPercentage: number;
    recommendedSkills: string[];
    personalized: boolean;
  }>({
    careerMatch: "",
    matchPercentage: 0,
    recommendedSkills: [],
    personalized: false,
  });
  const [isRefreshingAI, setIsRefreshingAI] = useState(false);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(true);
  const [notifications, setNotifications] = useState<
    Array<{ id: number; text: string; read: boolean }>
  >([
    { id: 1, text: "New job matches available", read: false },
    {
      id: 2,
      text: "Complete your profile to get better recommendations",
      read: false,
    },
    { id: 3, text: "New assessment available: Technical Skills", read: false },
  ]);
  const [quickQuestion, setQuickQuestion] = useState("");
  const [quickAnswer, setQuickAnswer] = useState("");
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [skillsData, setSkillsData] = useState<SkillData[]>([]);
  const [showSkillsTooltip, setShowSkillsTooltip] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    careers: false,
    skills: false,
    jobs: false,
  });
  const chartRef = useRef<HTMLDivElement>(null);

  // Mock data for the dashboard
  const userData = {
    username: authUser?.username || "User",
    completedAssessments: 2,
    totalAssessments: 5,
    skillsMatched: 65,
    recommendedCareers: [
      { title: "Software Developer", match: 85 },
      { title: "Data Analyst", match: 78 },
      { title: "UX Designer", match: 72 },
    ],
    recentActivities: [
      {
        type: "assessment",
        title: "Technical Skills Assessment",
        date: "2 days ago",
      },
      {
        type: "career",
        title: "Viewed Software Developer career path",
        date: "3 days ago",
      },
      {
        type: "job",
        title: "Applied for Frontend Developer at Tech Co",
        date: "1 week ago",
      },
    ],
    upcomingEvents: [
      { title: "Career Workshop: Tech Industry", date: "May 15, 2023" },
      { title: "Mock Interview Session", date: "May 20, 2023" },
    ],
    jobMatches: [
      { title: "Frontend Developer", company: "Tech Solutions Ltd", match: 92 },
      {
        title: "Junior Software Engineer",
        company: "Innovate Uganda",
        match: 88,
      },
      { title: "Web Developer", company: "Digital Creatives", match: 75 },
    ],
    skillsToImprove: [
      { name: "JavaScript", progress: 65 },
      { name: "React", progress: 45 },
      { name: "UI/UX Design", progress: 30 },
    ],
  };

  // Simulate loading AI recommendations
  useEffect(() => {
    const getAiRecommendations = async () => {
      // In a real app, this would be an API call to your AI service
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAiRecommendations({
        careerMatch: "Full Stack Developer",
        matchPercentage: 87,
        recommendedSkills: ["Node.js", "React", "Database Design"],
        personalized: true,
      });
    };

    getAiRecommendations();
  }, []);

  // Initialize skills data for chart
  useEffect(() => {
    setSkillsData([
      { name: "JavaScript", value: 65 },
      { name: "React", value: 45 },
      { name: "HTML/CSS", value: 80 },
      { name: "Node.js", value: 40 },
      { name: "UI/UX", value: 30 },
    ]);
  }, []);

  // Draw skills radar chart
  useEffect(() => {
    if (chartRef.current && skillsData.length > 0) {
      const drawRadarChart = () => {
        const canvas = document.createElement("canvas");
        canvas.width = chartRef.current!.clientWidth;
        canvas.height = 300;
        chartRef.current!.innerHTML = "";
        chartRef.current!.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;

        // Draw background circles
        ctx.strokeStyle = "#e5e7eb";
        ctx.fillStyle = "#f9fafb";

        for (let i = 1; i <= 4; i++) {
          const r = radius * (i / 4);
          ctx.beginPath();
          ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }

        // Draw axes
        const angleStep = (2 * Math.PI) / skillsData.length;

        ctx.strokeStyle = "#d1d5db";
        for (let i = 0; i < skillsData.length; i++) {
          const angle = i * angleStep;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle),
          );
          ctx.stroke();

          // Draw labels
          ctx.fillStyle = "#6b7280";
          ctx.font = "12px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const labelX = centerX + (radius + 20) * Math.cos(angle);
          const labelY = centerY + (radius + 20) * Math.sin(angle);
          ctx.fillText(skillsData[i].name, labelX, labelY);
        }

        // Draw data points
        const points: [number, number][] = [];
        for (let i = 0; i < skillsData.length; i++) {
          const angle = i * angleStep;
          const value = skillsData[i].value / 100;
          const x = centerX + radius * value * Math.cos(angle);
          const y = centerY + radius * value * Math.sin(angle);
          points.push([x, y]);
        }

        // Draw filled area
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
        ctx.fill();

        // Draw outline
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(59, 130, 246, 0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw points
        ctx.fillStyle = "rgba(59, 130, 246, 1)";
        for (const [x, y] of points) {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      };

      drawRadarChart();

      // Redraw on window resize
      const handleResize = () => {
        drawRadarChart();
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [skillsData]);

  const refreshAIRecommendations = async () => {
    setIsRefreshingAI(true);
    setAiRecommendations({
      ...aiRecommendations,
      personalized: false,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setAiRecommendations({
      careerMatch: "Full Stack Developer",
      matchPercentage: 89, // Slightly different to show it updated
      recommendedSkills: [
        "Node.js",
        "React",
        "Database Design",
        "Cloud Services",
      ],
      personalized: true,
    });
    setIsRefreshingAI(false);
  };

  const dismissWelcomeGuide = () => {
    setShowWelcomeGuide(false);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleQuickQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;

    setIsAskingQuestion(true);
    setQuickAnswer("");

    try {
      const answer = await fetchAIResponse(quickQuestion);
      setQuickAnswer(answer);
    } catch (error) {
      setQuickAnswer(
        "Sorry, I couldn't process your question. Please try again.",
      );
    } finally {
      setIsAskingQuestion(false);
    }
  };

  const resetQuickQuestion = () => {
    setQuickQuestion("");
    setQuickAnswer("");
  };

  const toggleCardExpansion = (cardName: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardName]: !prev[cardName],
    }));
  };

  const updateSkillValue = (skillName: string, newValue: number) => {
    setSkillsData((prev) =>
      prev.map((skill) =>
        skill.name === skillName ? { ...skill, value: newValue } : skill,
      ),
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userData.username}</p>
        </div>
        <div className="mt-4 flex gap-2 md:mt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="relative">
                      <Bell className="h-4 w-4" />
                      {notifications.some((n) => !n.read) && (
                        <span className="absolute -right-1 -top-1 flex h-3 w-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="flex items-center justify-between border-b p-4">
                      <h3 className="font-medium">Notifications</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllNotificationsAsRead}
                      >
                        Mark all read
                      </Button>
                    </div>
                    <ScrollArea className="h-[300px]">
                      {notifications.length > 0 ? (
                        <div className="divide-y">
                          {notifications.map((notification) => (
                            <div key={notification.id} className="relative p-4">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-2 h-6 w-6"
                                onClick={() =>
                                  dismissNotification(notification.id)
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <div className="pr-6">
                                <p
                                  className={`text-sm ${notification.read ? "text-muted-foreground" : "font-medium"}`}
                                >
                                  {notification.text}
                                </p>
                                {!notification.read && (
                                  <div className="mt-1">
                                    <Badge
                                      variant="outline"
                                      className="bg-primary/10 text-xs text-primary"
                                    >
                                      New
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No notifications
                        </div>
                      )}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button asChild>
            <Link href="/assessment">
              <ListChecks className="mr-2 h-4 w-4" />
              Take Assessment
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              View Profile
            </Link>
          </Button>
        </div>
      </div>

      {/* Welcome Guide */}
      {showWelcomeGuide && (
        <div className="relative mb-6">
          <Card className="border-primary/20 bg-primary/5">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={dismissWelcomeGuide}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardContent className="pb-4 pt-6">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-medium">
                    Welcome to Your Career Dashboard!
                  </h3>
                  <p className="mb-2 text-muted-foreground">
                    Here's how to get started on your career journey:
                  </p>
                  <ol className="list-inside list-decimal space-y-1 text-sm">
                    <li>
                      Complete your{" "}
                      <Link
                        href="/profile"
                        className="text-primary hover:underline"
                      >
                        profile
                      </Link>{" "}
                      to get personalized recommendations
                    </li>
                    <li>
                      Take a{" "}
                      <Link
                        href="/assessment"
                        className="text-primary hover:underline"
                      >
                        skill assessment
                      </Link>{" "}
                      to discover your strengths
                    </li>
                    <li>
                      Explore{" "}
                      <Link
                        href="/careers"
                        className="text-primary hover:underline"
                      >
                        career paths
                      </Link>{" "}
                      that match your skills
                    </li>
                    <li>
                      Ask our{" "}
                      <Link
                        href="/ai-advisor"
                        className="text-primary hover:underline"
                      >
                        AI Advisor
                      </Link>{" "}
                      for personalized guidance
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New AI Advisor Card */}
      <div className="mb-6">
        <Card className="relative overflow-hidden border-primary/20">
          <div className="absolute right-0 top-0 h-24 w-24 opacity-5 md:h-40 md:w-40">
            <Bot className="h-full w-full text-primary" />
          </div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>AI Career Insight</CardTitle>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={refreshAIRecommendations}
                      disabled={isRefreshingAI}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${isRefreshingAI ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh recommendations</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>
              Personalized career recommendations powered by AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-4 rounded-lg bg-primary/5 p-4">
                  {aiRecommendations.personalized ? (
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium">
                          Top Career Match: {aiRecommendations.careerMatch}
                        </h3>
                        <div className="mb-1 mt-1 flex justify-between text-sm">
                          <span>Match Score</span>
                          <span className="font-medium">
                            {aiRecommendations.matchPercentage}%
                          </span>
                        </div>
                        <Progress
                          value={aiRecommendations.matchPercentage}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <h3 className="mt-3 text-sm font-medium">
                          Recommended Skills to Develop:
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {aiRecommendations.recommendedSkills.map(
                            (skill, i) => (
                              <span
                                key={i}
                                className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                              >
                                {skill}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-24 items-center justify-center">
                      <div className="text-center">
                        <div className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground">
                          Analyzing your profile...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Question Section */}
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-medium">
                    Ask a Quick Career Question:
                  </h3>
                  <form
                    onSubmit={handleQuickQuestionSubmit}
                    className="space-y-2"
                  >
                    <div className="flex gap-2">
                      <Input
                        placeholder="E.g., What skills do I need for web development?"
                        value={quickQuestion}
                        onChange={(e) => setQuickQuestion(e.target.value)}
                        disabled={isAskingQuestion || !!quickAnswer}
                      />
                      {!quickAnswer ? (
                        <Button
                          type="submit"
                          disabled={isAskingQuestion || !quickQuestion.trim()}
                        >
                          {isAskingQuestion ? (
                            <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Send className="mr-1 h-4 w-4" />
                          )}
                          Ask
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={resetQuickQuestion}>
                          <X className="mr-1 h-4 w-4" />
                          Reset
                        </Button>
                      )}
                    </div>
                    {isAskingQuestion && (
                      <div className="animate-pulse text-sm text-muted-foreground">
                        Thinking...
                      </div>
                    )}
                    {quickAnswer && (
                      <div className="rounded-md bg-muted p-3 text-sm">
                        {quickAnswer}
                      </div>
                    )}
                  </form>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button className="w-full" asChild>
                  <Link href="/ai-advisor">
                    <MessageSquareText className="mr-2 h-4 w-4" />
                    Ask AI Advisor
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/assessment">
                    <ListChecks className="mr-2 h-4 w-4" />
                    Complete Assessment
                  </Link>
                </Button>
                <div className="mt-2 text-center text-xs text-muted-foreground">
                  More assessments = better recommendations
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="careers">Careers</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Assessment Progress
                </CardTitle>
                <ListChecks className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userData.completedAssessments}/{userData.totalAssessments}
                </div>
                <p className="text-xs text-muted-foreground">
                  Assessments completed
                </p>
                <Progress
                  value={
                    (userData.completedAssessments /
                      userData.totalAssessments) *
                    100
                  }
                  className="mt-3"
                />
              </CardContent>
              <CardFooter className="px-6 pb-3 pt-0">
                <Button variant="link" className="h-auto p-0" asChild>
                  <Link href="/assessment">Take next assessment</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Skills Match
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userData.skillsMatched}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Match with top career
                </p>
                <Progress value={userData.skillsMatched} className="mt-3" />
              </CardContent>
              <CardFooter className="px-6 pb-3 pt-0">
                <Button variant="link" className="h-auto p-0" asChild>
                  <Link href="/skill-assessment">View skills details</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Job Matches
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userData.jobMatches.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Matching job opportunities
                </p>
                <Progress value={75} className="mt-3" />
              </CardContent>
              <CardFooter className="px-6 pb-3 pt-0">
                <Button variant="link" className="h-auto p-0" asChild>
                  <Link href="/jobs">View all jobs</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Recommended Careers */}
          <Card className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Recommended Careers</CardTitle>
                <CardDescription>
                  Based on your skills and interests
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleCardExpansion("careers")}
              >
                {expandedCards.careers ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.recommendedCareers
                  .slice(0, expandedCards.careers ? undefined : 2)
                  .map((career, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{career.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {career.match}% match
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Link
                          href={`/career/${career.title.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                <Button variant="outline" className="mt-2 w-full" asChild>
                  <Link href="/careers">
                    <Plus className="mr-2 h-4 w-4" />
                    Explore More Careers
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity and Upcoming Events */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.recentActivities.map((activity, index) => (
                    <div key={index} className="group flex items-start">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                        {activity.type === "assessment" ? (
                          <ListChecks className="h-4 w-4 text-primary" />
                        ) : activity.type === "career" ? (
                          <GraduationCap className="h-4 w-4 text-primary" />
                        ) : (
                          <Briefcase className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Events that might interest you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.upcomingEvents.map((event, index) => (
                    <div key={index} className="group flex items-start">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.date}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="mt-2 w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    View All Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Skills tab with interactive chart */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Skills Radar</CardTitle>
                  <CardDescription>
                    Visualize your skill proficiency
                  </CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip
                    open={showSkillsTooltip}
                    onOpenChange={setShowSkillsTooltip}
                  >
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Update Skills
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adjust the sliders below to update your skills</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]" ref={chartRef}></div>

              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">Adjust Your Skills:</h3>
                {skillsData.map((skill, index) => (
                  <div key={index}>
                    <div className="mb-1 flex justify-between">
                      <span className="text-sm">{skill.name}</span>
                      <span className="text-sm font-medium">
                        {skill.value}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.value}
                      onChange={(e) =>
                        updateSkillValue(
                          skill.name,
                          Number.parseInt(e.target.value),
                        )
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/assessment">
                  <ListChecks className="mr-2 h-4 w-4" />
                  Take Skill Assessment
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills to Improve</CardTitle>
              <CardDescription>
                Focus on these skills to enhance your career prospects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userData.skillsToImprove.map((skill, index) => (
                  <div key={index} className="group">
                    <div className="mb-1 flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.progress}%
                      </span>
                    </div>
                    <Progress
                      value={skill.progress}
                      className="h-2 transition-all group-hover:h-3"
                    />
                    <div className="mt-2 flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="link" className="h-auto p-0 text-sm">
                        Find resources
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jobs tab with interactive elements */}
        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Job Matches</CardTitle>
                  <CardDescription>
                    Jobs that match your skills and experience
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleCardExpansion("jobs")}
                >
                  {expandedCards.jobs ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userData.jobMatches
                  .slice(0, expandedCards.jobs ? undefined : 2)
                  .map((job, index) => (
                    <div
                      key={index}
                      className="group border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{job.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {job.company}
                          </div>
                        </div>
                        <div className="rounded-full bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                          {job.match}% Match
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress
                          value={job.match}
                          className="h-2 transition-all group-hover:h-3"
                        />
                      </div>
                      <div className="mt-4 flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Compare Skills
                        </Button>
                        <Button size="sm" asChild>
                          <Link
                            href={`/job/${job.title.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            View Job
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
              <Button variant="outline" className="mt-6 w-full" asChild>
                <Link href="/jobs">
                  <Briefcase className="mr-2 h-4 w-4" />
                  View All Jobs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs remain the same */}
        <TabsContent value="careers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Career Matches</CardTitle>
              <CardDescription>Careers that match your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userData.recommendedCareers.map((career, index) => (
                  <div
                    key={index}
                    className="group border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{career.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {career.match}% match
                          </div>
                        </div>
                      </div>
                      <div className="rounded-full bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                        {career.match}% Match
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress
                        value={career.match}
                        className="h-2 transition-all group-hover:h-3"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <LineChart className="mr-2 h-4 w-4" />
                        Compare Skills
                      </Button>
                      <Button size="sm" asChild>
                        <Link
                          href={`/career/${career.title.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Your latest actions on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userData.recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="group flex items-start border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                      {activity.type === "assessment" ? (
                        <ListChecks className="h-5 w-5 text-primary" />
                      ) : activity.type === "career" ? (
                        <GraduationCap className="h-5 w-5 text-primary" />
                      ) : (
                        <Briefcase className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.date}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {activity.type === "assessment"
                          ? "You completed an assessment to evaluate your skills."
                          : activity.type === "career"
                            ? "You explored a career path to learn more about it."
                            : "You applied for a job position."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events that might interest you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userData.upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="group flex items-start border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.date}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Join this event to enhance your career prospects and
                        networking opportunities.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Bell icon component
function Bell({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

// Then update the SidebarLink component at the bottom of the file
function SidebarLink({ icon, label, active, onClick }: SidebarLinkProps) {
  return (
    <button
      className={`flex w-full items-center rounded-md px-3 py-2 text-left ${
        active
          ? "bg-primary/10 text-primary"
          : "text-gray-600 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
