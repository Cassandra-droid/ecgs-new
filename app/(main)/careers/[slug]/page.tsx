"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  BarChart,
  GraduationCap,
  Clock,
  Bot,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Add these interfaces at the top of the file
interface CareerDetailProps {
  params: {
    slug: string;
  };
}

interface CareerData {
  title: string;
  description: string;
  averageSalary: string;
  growthRate: string;
  educationRequired: string;
  experienceLevel: string;
  keySkills: Array<{
    name: string;
    level: number;
  }>;
  relatedCourses: Array<{
    name: string;
    provider: string;
    duration: string;
  }>;
  jobOpportunities: Array<{
    title: string;
    company: string;
    location: string;
  }>;
}

interface LearningPathStep {
  title: string;
  description: string;
  resources: Array<{
    name: string;
    type: "course" | "book" | "practice" | "project";
    provider?: string;
    url?: string;
  }>;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// Update the component definition
export default function CareerDetailPage({ params }: CareerDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Convert slug to a readable title (e.g., "software-developer" to "Software Developer")
  const title = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Mock career data
  const career: CareerData = {
    title,
    description: `A ${title} is responsible for designing, developing, and maintaining software applications or systems. They work with various programming languages and frameworks to create solutions that meet user needs and business requirements.`,
    averageSalary: "$800 - $1,500/month",
    growthRate: "+15% annually",
    educationRequired: "Bachelor's degree in Computer Science or related field",
    experienceLevel: "Entry-level to Senior positions available",
    keySkills: [
      { name: "Programming", level: 85 },
      { name: "Problem Solving", level: 90 },
      { name: "Software Design", level: 75 },
      { name: "Database Management", level: 70 },
      { name: "Version Control", level: 80 },
    ],
    relatedCourses: [
      {
        name: "Web Development Fundamentals",
        provider: "Coursera",
        duration: "8 weeks",
      },
      {
        name: "Data Structures and Algorithms",
        provider: "edX",
        duration: "10 weeks",
      },
      {
        name: "Software Engineering Principles",
        provider: "Udemy",
        duration: "6 weeks",
      },
    ],
    jobOpportunities: [
      {
        title: "Junior Software Developer",
        company: "Tech Solutions Ltd",
        location: "Kampala",
      },
      {
        title: "Frontend Developer",
        company: "Innovate Uganda",
        location: "Kampala",
      },
      {
        title: "Mobile App Developer",
        company: "AppWorks",
        location: "Remote",
      },
    ],
  };

  // Mock AI-generated learning path
  const learningPath: LearningPathStep[] = [
    {
      title: "Getting Started with Programming",
      description:
        "Build a solid foundation in programming fundamentals and basic computer science concepts.",
      resources: [
        {
          name: "Introduction to Computer Science",
          type: "course",
          provider: "edX",
          url: "#",
        },
        {
          name: "Programming Fundamentals",
          type: "course",
          provider: "Coursera",
          url: "#",
        },
        {
          name: "Practice: Basic Programming Problems",
          type: "practice",
          url: "#",
        },
      ],
      duration: "2-3 months",
      difficulty: "beginner",
    },
    {
      title: "Web Development Basics",
      description:
        "Learn the core technologies of web development: HTML, CSS, and JavaScript.",
      resources: [
        {
          name: "HTML & CSS for Beginners",
          type: "course",
          provider: "Codecademy",
          url: "#",
        },
        {
          name: "JavaScript Basics",
          type: "course",
          provider: "freeCodeCamp",
          url: "#",
        },
        {
          name: "Project: Personal Portfolio Website",
          type: "project",
          url: "#",
        },
      ],
      duration: "3-4 months",
      difficulty: "beginner",
    },
    {
      title: "Backend Development",
      description:
        "Develop server-side programming skills and learn about databases and APIs.",
      resources: [
        {
          name: "Node.js for Beginners",
          type: "course",
          provider: "Udemy",
          url: "#",
        },
        {
          name: "SQL and Database Design",
          type: "course",
          provider: "Khan Academy",
          url: "#",
        },
        {
          name: "RESTful API Development",
          type: "course",
          provider: "Pluralsight",
          url: "#",
        },
        {
          name: "Project: Simple Backend Application",
          type: "project",
          url: "#",
        },
      ],
      duration: "4-5 months",
      difficulty: "intermediate",
    },
    {
      title: "Advanced Concepts",
      description:
        "Deepen your understanding with advanced programming concepts and specialized topics.",
      resources: [
        {
          name: "Data Structures and Algorithms",
          type: "course",
          provider: "MIT OpenCourseWare",
          url: "#",
        },
        { name: "System Design", type: "book", provider: "O'Reilly", url: "#" },
        {
          name: "Cloud Computing Fundamentals",
          type: "course",
          provider: "AWS",
          url: "#",
        },
        { name: "Project: Full-Stack Application", type: "project", url: "#" },
      ],
      duration: "5-6 months",
      difficulty: "advanced",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Career Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary/10">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold md:text-3xl">
                      {career.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <BarChart className="mr-1 h-4 w-4" />
                        {career.growthRate} growth
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="mr-1 h-4 w-4" />
                        {career.educationRequired}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    85% Match
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:w-[500px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning-path">Learning Path</TabsTrigger>
            <TabsTrigger value="jobs">Job Opportunities</TabsTrigger>
          </TabsList>
        </Tabs>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold">Career Overview</h2>
                  <p className="mb-6 text-gray-600">{career.description}</p>

                  <h3 className="mb-2 text-lg font-bold">Average Salary</h3>
                  <p className="mb-4 text-gray-600">{career.averageSalary}</p>

                  <h3 className="mb-2 text-lg font-bold">Required Education</h3>
                  <p className="mb-4 text-gray-600">
                    {career.educationRequired}
                  </p>

                  <h3 className="mb-2 text-lg font-bold">Experience Levels</h3>
                  <p className="text-gray-600">{career.experienceLevel}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold">
                    Key Skills Required
                  </h2>
                  <div className="space-y-4">
                    {career.keySkills.map((skill, index) => (
                      <div key={index}>
                        <div className="mb-1 flex justify-between">
                          <span className="text-sm font-medium">
                            {skill.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {skill.level}%
                          </span>
                        </div>
                        <Progress value={skill.level} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="mb-1 flex items-center">
                    <Bot className="mr-2 h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">AI Career Advisor</CardTitle>
                  </div>
                  <CardDescription>
                    Personalized guidance for this career path
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="rounded-lg bg-primary/5 p-4">
                    <h3 className="mb-2 text-sm font-medium">
                      Top Skills to Focus On:
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <div className="mb-1 flex justify-between">
                          <span className="text-xs">JavaScript</span>
                          <span className="text-xs font-medium">
                            Priority: High
                          </span>
                        </div>
                        <Progress value={95} className="h-1.5" />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between">
                          <span className="text-xs">React</span>
                          <span className="text-xs font-medium">
                            Priority: High
                          </span>
                        </div>
                        <Progress value={90} className="h-1.5" />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between">
                          <span className="text-xs">Node.js</span>
                          <span className="text-xs font-medium">
                            Priority: Medium
                          </span>
                        </div>
                        <Progress value={75} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/ai-advisor">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Personalized Advice
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold">
                    Recommended Courses
                  </h2>
                  <div className="space-y-4">
                    {career.relatedCourses.map((course, index) => (
                      <div
                        key={index}
                        className="border-b pb-4 last:border-0 last:pb-0"
                      >
                        <h3 className="font-medium">{course.name}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{course.provider}</span>
                          <span className="mx-2">•</span>
                          <Clock className="mr-1 h-3 w-3" />
                          <span>{course.duration}</span>
                        </div>
                        <Button
                          variant="link"
                          className="mt-1 h-auto p-0"
                          asChild
                        >
                          <Link href="#">View Course</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="learning-path" className="mt-0">
          <div className="mb-6">
            <Alert className="border-primary/10 bg-primary/5">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertTitle>AI-Generated Learning Path</AlertTitle>
              <AlertDescription>
                This personalized learning path is generated by our AI based on
                industry requirements and best practices for becoming a{" "}
                {career.title}.
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-12">
            {learningPath.map((step, index) => (
              <div
                key={index}
                className="relative pl-8 before:absolute before:left-3 before:top-0 before:h-full before:w-px before:bg-primary/20"
              >
                <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {index + 1}
                </div>

                <Card className="border-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <CardTitle>{step.title}</CardTitle>
                      <span
                        className={`ml-auto rounded-full px-2 py-1 text-xs font-medium ${
                          step.difficulty === "beginner"
                            ? "bg-green-100 text-green-800"
                            : step.difficulty === "intermediate"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {step.difficulty.charAt(0).toUpperCase() +
                          step.difficulty.slice(1)}
                      </span>
                    </div>
                    <CardDescription>{step.description}</CardDescription>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Estimated time: {step.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="mb-2 text-sm font-medium">
                      Recommended Resources:
                    </h3>
                    <div className="grid gap-3">
                      {step.resources.map((resource, rIndex) => (
                        <div
                          key={rIndex}
                          className="flex items-start border-b pb-3 last:border-0 last:pb-0"
                        >
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            {resource.type === "course" ? (
                              <BookOpen className="h-4 w-4 text-primary" />
                            ) : resource.type === "book" ? (
                              <BookOpen className="h-4 w-4 text-primary" />
                            ) : resource.type === "practice" ? (
                              <GraduationCap className="h-4 w-4 text-primary" />
                            ) : (
                              <Briefcase className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{resource.name}</h4>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {resource.provider && (
                                <span className="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                  {resource.provider}
                                </span>
                              )}
                              <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                {resource.type.charAt(0).toUpperCase() +
                                  resource.type.slice(1)}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={resource.url || "#"}>View</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            <div className="pt-6 text-center">
              <Button asChild>
                <Link href="/ai-advisor">
                  <Bot className="mr-2 h-4 w-4" />
                  Get Customized Learning Path
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Job Opportunities</CardTitle>
              <CardDescription>
                Current openings matching this career path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {career.jobOpportunities.map((job, index) => (
                  <div
                    key={index}
                    className="border-b pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{job.title}</h3>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <span>{job.company}</span>
                          <span className="mx-2">•</span>
                          <span>{job.location}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                            New
                          </span>
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                            Full-time
                          </span>
                          <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
                            Entry Level
                          </span>
                        </div>
                      </div>
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
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/jobs">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse All Job Listings
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </div>
    </div>
  );
}
