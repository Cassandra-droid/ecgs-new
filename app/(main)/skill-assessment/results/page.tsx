/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Star,
  StarHalf,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Award,
  BarChart,
  ExternalLink,
} from "lucide-react";

// Interface for a skill entry
interface SkillEntry {
  name: string;
  type: string;
  score: number;
}

// Interface for assessment results
interface AssessmentResults {
  percentageScores: Record<string, number>;
  strongSkills: SkillEntry[];
  skillsToImprove: SkillEntry[];
  missingSkills: {
    skill: string;
    resourceType: string;
    link: string;
  }[];
  careerRecommendations: {
    career: string;
    matchPercentage: number;
    requiredSkills: string[];
  }[];
}

export default function ResultsPage() {
  const [assessmentData, setAssessmentData] = useState<{
    skills: SkillEntry[];
  } | null>(null);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get assessment data from localStorage
    const storedData = localStorage.getItem("assessmentData");

    if (!storedData) {
      setError(
        "No assessment data found. Please complete the assessment first.",
      );
      setLoading(false);
      return;
    }

    try {
      const parsedData = JSON.parse(storedData) as { skills: SkillEntry[] };
      setAssessmentData(parsedData);

      // Process the assessment data to generate results
      processAssessmentData(parsedData.skills);
    } catch (e) {
      console.error("Error parsing assessment data:", e);
      setError("Invalid assessment data. Please try again.");
      setLoading(false);
    }
  }, []);

  // Process the assessment data to generate results
  const processAssessmentData = (skills: SkillEntry[]) => {
    try {
      // Calculate percentage scores by skill type
      const percentageScores = calculatePercentageScores(skills);

      // Categorize skills
      const { strongSkills, skillsToImprove, missingSkills } =
        categorizeSkills(skills);

      // Generate career recommendations
      const careerRecommendations = generateCareerRecommendations(skills);

      setResults({
        percentageScores,
        strongSkills,
        skillsToImprove,
        missingSkills,
        careerRecommendations,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error processing assessment data:", error);
      setError("Failed to process assessment data. Please try again.");
      setLoading(false);
    }
  };

  // Calculate percentage scores by skill type
  const calculatePercentageScores = (
    skills: SkillEntry[],
  ): Record<string, number> => {
    // Group skills by type
    const skillsByType: Record<string, SkillEntry[]> = {};
    skills.forEach((skill) => {
      if (!skillsByType[skill.type]) {
        skillsByType[skill.type] = [];
      }
      skillsByType[skill.type].push(skill);
    });

    // Calculate average score for each type
    const percentageScores: Record<string, number> = {};
    Object.entries(skillsByType).forEach(([type, typeSkills]) => {
      const totalScore = typeSkills.reduce(
        (sum, skill) => sum + skill.score,
        0,
      );
      const averageScore = (totalScore / typeSkills.length) * 20; // Convert to percentage (0-100)
      percentageScores[type] = Math.round(averageScore);
    });

    return percentageScores;
  };

  // Categorize skills into strong skills, skills to improve, and missing skills
  const categorizeSkills = (
    skills: SkillEntry[],
  ): {
    strongSkills: SkillEntry[];
    skillsToImprove: SkillEntry[];
    missingSkills: { skill: string; resourceType: string; link: string }[];
  } => {
    // Categorize skills based on score
    const strongSkills = skills.filter((skill) => skill.score >= 4);
    const skillsToImprove = skills.filter((skill) => skill.score < 4);

    // Generate missing skills based on the user's skills and gaps
    const missingSkills = generateMissingSkills(skills);

    return { strongSkills, skillsToImprove, missingSkills };
  };

  // Generate missing skills based on the user's skills and identified gaps
  const generateMissingSkills = (
    skills: SkillEntry[],
  ): { skill: string; resourceType: string; link: string }[] => {
    // Find the user's strongest skill category
    const skillsByType: Record<string, SkillEntry[]> = {};
    skills.forEach((skill) => {
      if (!skillsByType[skill.type]) {
        skillsByType[skill.type] = [];
      }
      skillsByType[skill.type].push(skill);
    });

    // Calculate average score for each type
    const averageScores: Record<string, number> = {};
    Object.entries(skillsByType).forEach(([type, typeSkills]) => {
      const totalScore = typeSkills.reduce(
        (sum, skill) => sum + skill.score,
        0,
      );
      averageScores[type] = totalScore / typeSkills.length;
    });

    // Sort categories by average score
    const sortedCategories = Object.entries(averageScores)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => category);

    // Get the top category
    const topCategory = sortedCategories[0];

    // Get all skills names to check for gaps
    const existingSkills = new Set(skills.map((s) => s.name.toLowerCase()));

    // Generate missing skills based on the top category and specific skill gaps
    const missingSkills: {
      skill: string;
      resourceType: string;
      link: string;
    }[] = [];

    // Technical Skills gaps
    if (topCategory === "Technical Skills") {
      // Check for specific technical skill gaps
      const hasWebDev = skills.some(
        (s) =>
          s.name.toLowerCase().includes("web") ||
          s.name.toLowerCase().includes("html") ||
          s.name.toLowerCase().includes("css") ||
          s.name.toLowerCase().includes("javascript"),
      );

      const hasDataScience = skills.some(
        (s) =>
          s.name.toLowerCase().includes("data") ||
          s.name.toLowerCase().includes("machine learning") ||
          s.name.toLowerCase().includes("statistics"),
      );

      const hasDevOps = skills.some(
        (s) =>
          s.name.toLowerCase().includes("devops") ||
          s.name.toLowerCase().includes("cloud") ||
          s.name.toLowerCase().includes("docker"),
      );

      const hasMobile = skills.some(
        (s) =>
          s.name.toLowerCase().includes("mobile") ||
          s.name.toLowerCase().includes("android") ||
          s.name.toLowerCase().includes("ios"),
      );

      const hasSecurity = skills.some(
        (s) =>
          s.name.toLowerCase().includes("security") ||
          s.name.toLowerCase().includes("cyber"),
      );

      // Add complementary skills based on existing skills
      if (hasWebDev && !existingSkills.has("react")) {
        missingSkills.push({
          skill: "React",
          resourceType: "Documentation",
          link: "https://react.dev/learn",
        });
      }

      if (hasDataScience && !existingSkills.has("tensorflow")) {
        missingSkills.push({
          skill: "TensorFlow",
          resourceType: "Learning Platform",
          link: "https://www.tensorflow.org/learn",
        });
      }

      if (hasDevOps && !existingSkills.has("kubernetes")) {
        missingSkills.push({
          skill: "Kubernetes",
          resourceType: "Documentation",
          link: "https://kubernetes.io/docs/tutorials/",
        });
      }

      if (hasMobile && !existingSkills.has("flutter")) {
        missingSkills.push({
          skill: "Flutter",
          resourceType: "Developer Resource",
          link: "https://flutter.dev/learn",
        });
      }

      if (hasSecurity && !existingSkills.has("penetration testing")) {
        missingSkills.push({
          skill: "Penetration Testing",
          resourceType: "Community Resource",
          link: "https://owasp.org/www-project-web-security-testing-guide/",
        });
      }

      // Add generally valuable technical skills
      if (
        !existingSkills.has("git") &&
        !existingSkills.has("version control")
      ) {
        missingSkills.push({
          skill: "Git & Version Control",
          resourceType: "Learning Resource",
          link: "https://git-scm.com/doc",
        });
      }

      if (!existingSkills.has("api design") && !existingSkills.has("restful")) {
        missingSkills.push({
          skill: "API Design",
          resourceType: "Community Guide",
          link: "https://restfulapi.net/",
        });
      }
    }
    // Soft Skills gaps
    else if (topCategory === "Soft Skills") {
      const hasCommunication = skills.some(
        (s) =>
          s.name.toLowerCase().includes("communication") ||
          s.name.toLowerCase().includes("writing") ||
          s.name.toLowerCase().includes("speaking"),
      );

      const hasLeadership = skills.some(
        (s) =>
          s.name.toLowerCase().includes("leadership") ||
          s.name.toLowerCase().includes("management"),
      );

      const hasTeamwork = skills.some(
        (s) =>
          s.name.toLowerCase().includes("team") ||
          s.name.toLowerCase().includes("collaboration"),
      );

      // Add complementary skills based on existing skills
      if (hasCommunication && !existingSkills.has("public speaking")) {
        missingSkills.push({
          skill: "Public Speaking",
          resourceType: "Community Resource",
          link: "https://www.toastmasters.org/",
        });
      }

      if (hasLeadership && !existingSkills.has("conflict resolution")) {
        missingSkills.push({
          skill: "Conflict Resolution",
          resourceType: "Research Article",
          link: "https://hbr.org/topic/conflict",
        });
      }

      if (hasTeamwork && !existingSkills.has("emotional intelligence")) {
        missingSkills.push({
          skill: "Emotional Intelligence",
          resourceType: "Research Resource",
          link: "https://www.mindtools.com/pages/article/newCDV_59.htm",
        });
      }

      // Add generally valuable soft skills
      if (!existingSkills.has("negotiation")) {
        missingSkills.push({
          skill: "Negotiation",
          resourceType: "Academic Resource",
          link: "https://www.pon.harvard.edu/",
        });
      }

      if (!existingSkills.has("time management")) {
        missingSkills.push({
          skill: "Time Management",
          resourceType: "Productivity Guide",
          link: "https://todoist.com/productivity-methods",
        });
      }
    }
    // Management Skills gaps
    else if (topCategory === "Management Skills") {
      const hasProjectManagement = skills.some(
        (s) =>
          s.name.toLowerCase().includes("project management") ||
          s.name.toLowerCase().includes("agile"),
      );

      const hasStrategic = skills.some(
        (s) =>
          s.name.toLowerCase().includes("strategic") ||
          s.name.toLowerCase().includes("strategy"),
      );

      // Add complementary skills based on existing skills
      if (hasProjectManagement && !existingSkills.has("risk management")) {
        missingSkills.push({
          skill: "Risk Management",
          resourceType: "Professional Resource",
          link: "https://www.pmi.org/learning/library/risk-management",
        });
      }

      if (hasStrategic && !existingSkills.has("change management")) {
        missingSkills.push({
          skill: "Change Management",
          resourceType: "Professional Guide",
          link: "https://www.prosci.com/resources/articles",
        });
      }

      // Add generally valuable management skills
      if (!existingSkills.has("stakeholder management")) {
        missingSkills.push({
          skill: "Stakeholder Management",
          resourceType: "Business Resource",
          link: "https://www.mindtools.com/pages/article/newPPM_08.htm",
        });
      }

      if (!existingSkills.has("team leadership")) {
        missingSkills.push({
          skill: "Team Leadership",
          resourceType: "Leadership Resource",
          link: "https://www.ccl.org/articles/leading-effectively-articles/",
        });
      }
    }
    // Analytical Skills gaps
    else if (topCategory === "Analytical Skills") {
      const hasDataAnalysis = skills.some(
        (s) =>
          s.name.toLowerCase().includes("data analysis") ||
          s.name.toLowerCase().includes("analytics"),
      );

      const hasResearch = skills.some(
        (s) =>
          s.name.toLowerCase().includes("research") ||
          s.name.toLowerCase().includes("study"),
      );

      // Add complementary skills based on existing skills
      if (hasDataAnalysis && !existingSkills.has("data visualization")) {
        missingSkills.push({
          skill: "Data Visualization",
          resourceType: "Learning Resource",
          link: "https://www.tableau.com/learn/training",
        });
      }

      if (hasResearch && !existingSkills.has("experimental design")) {
        missingSkills.push({
          skill: "Experimental Design",
          resourceType: "Academic Resource",
          link: "https://www.scribbr.com/methodology/experimental-design/",
        });
      }

      // Add generally valuable analytical skills
      if (!existingSkills.has("statistical analysis")) {
        missingSkills.push({
          skill: "Statistical Analysis",
          resourceType: "Learning Resource",
          link: "https://www.khanacademy.org/math/statistics-probability",
        });
      }

      if (!existingSkills.has("critical thinking")) {
        missingSkills.push({
          skill: "Critical Thinking",
          resourceType: "Educational Resource",
          link: "https://www.criticalthinking.org/pages/defining-critical-thinking/766",
        });
      }
    }
    // Creative Skills gaps
    else if (topCategory === "Creative Skills") {
      const hasDesign = skills.some(
        (s) =>
          s.name.toLowerCase().includes("design") ||
          s.name.toLowerCase().includes("ui") ||
          s.name.toLowerCase().includes("ux"),
      );

      const hasWriting = skills.some(
        (s) =>
          s.name.toLowerCase().includes("writing") ||
          s.name.toLowerCase().includes("content"),
      );

      // Add complementary skills based on existing skills
      if (hasDesign && !existingSkills.has("user research")) {
        missingSkills.push({
          skill: "User Research",
          resourceType: "Design Resource",
          link: "https://www.nngroup.com/articles/",
        });
      }

      if (hasWriting && !existingSkills.has("storytelling")) {
        missingSkills.push({
          skill: "Storytelling",
          resourceType: "Creative Resource",
          link: "https://www.masterclass.com/articles/how-to-become-a-better-storyteller",
        });
      }

      // Add generally valuable creative skills
      if (!existingSkills.has("design thinking")) {
        missingSkills.push({
          skill: "Design Thinking",
          resourceType: "Educational Resource",
          link: "https://www.ideou.com/pages/design-thinking",
        });
      }

      if (!existingSkills.has("visual communication")) {
        missingSkills.push({
          skill: "Visual Communication",
          resourceType: "Design Resource",
          link: "https://www.canva.com/learn/",
        });
      }
    }
    // Domain Knowledge gaps
    else if (topCategory === "Domain Knowledge") {
      // Add generally valuable domain knowledge skills
      if (!existingSkills.has("industry trends")) {
        missingSkills.push({
          skill: "Industry Trends Analysis",
          resourceType: "Research Resource",
          link: "https://trends.google.com/trends/",
        });
      }

      if (!existingSkills.has("competitive analysis")) {
        missingSkills.push({
          skill: "Competitive Analysis",
          resourceType: "Business Resource",
          link: "https://hbr.org/topic/competitive-strategy",
        });
      }

      if (!existingSkills.has("market research")) {
        missingSkills.push({
          skill: "Market Research",
          resourceType: "Business Resource",
          link: "https://www.marketresearch.com/",
        });
      }
    }

    // If we still don't have enough missing skills, add some general ones
    if (missingSkills.length < 3) {
      const generalSkills = [
        {
          skill: "Continuous Learning",
          resourceType: "Learning Platform",
          link: "https://www.coursera.org/",
        },
        {
          skill: "Problem Solving",
          resourceType: "Educational Resource",
          link: "https://www.mindtools.com/pages/article/newTMC_00.htm",
        },
        {
          skill: "Digital Literacy",
          resourceType: "Educational Resource",
          link: "https://www.digitallearn.org/",
        },
        {
          skill: "Adaptability",
          resourceType: "Career Resource",
          link: "https://www.indeed.com/career-advice/career-development/adaptability-skills",
        },
      ];

      for (const skill of generalSkills) {
        if (
          !existingSkills.has(skill.skill.toLowerCase()) &&
          missingSkills.length < 3
        ) {
          missingSkills.push(skill);
        }
      }
    }

    return missingSkills.slice(0, 3); // Limit to 3 missing skills
  };

  // Generate career recommendations based on skills
  const generateCareerRecommendations = (
    skills: SkillEntry[],
  ): {
    career: string;
    matchPercentage: number;
    requiredSkills: string[];
  }[] => {
    // Create a map of all available careers with their required skills
    const careerDatabase = [
      // Technical careers
      {
        career: "Data Scientist",
        category: "Technical Skills",
        requiredSkills: [
          "Python Programming",
          "Data Analysis",
          "Machine Learning",
          "Statistical Analysis",
          "Data Visualization",
        ],
        keywords: [
          "python",
          "data",
          "machine learning",
          "statistics",
          "analytics",
          "ai",
          "artificial intelligence",
          "deep learning",
          "tensorflow",
          "pytorch",
        ],
      },
      {
        career: "Web Developer",
        category: "Technical Skills",
        requiredSkills: [
          "JavaScript",
          "HTML/CSS",
          "Web Development",
          "React/Angular/Vue",
          "Responsive Design",
        ],
        keywords: [
          "javascript",
          "html",
          "css",
          "web",
          "frontend",
          "react",
          "angular",
          "vue",
          "node.js",
          "typescript",
        ],
      },
      {
        career: "Mobile App Developer",
        category: "Technical Skills",
        requiredSkills: [
          "Mobile App Development",
          "Swift/Kotlin",
          "UI/UX Design",
          "API Integration",
          "Cross-Platform Development",
        ],
        keywords: [
          "mobile",
          "ios",
          "android",
          "swift",
          "kotlin",
          "react native",
          "flutter",
          "xamarin",
          "app",
        ],
      },
      {
        career: "DevOps Engineer",
        category: "Technical Skills",
        requiredSkills: [
          "Cloud Computing",
          "CI/CD",
          "Infrastructure as Code",
          "Containerization",
          "Automation",
        ],
        keywords: [
          "devops",
          "cloud",
          "aws",
          "azure",
          "gcp",
          "docker",
          "kubernetes",
          "terraform",
          "jenkins",
          "ci/cd",
        ],
      },
      {
        career: "Cybersecurity Specialist",
        category: "Technical Skills",
        requiredSkills: [
          "Network Security",
          "Threat Analysis",
          "Security Protocols",
          "Penetration Testing",
          "Security Auditing",
        ],
        keywords: [
          "security",
          "cyber",
          "network",
          "penetration testing",
          "encryption",
          "firewall",
          "vulnerability",
          "threat",
        ],
      },
      {
        career: "Full Stack Developer",
        category: "Technical Skills",
        requiredSkills: [
          "Frontend Development",
          "Backend Development",
          "Database Management",
          "API Design",
          "Version Control",
        ],
        keywords: [
          "full stack",
          "frontend",
          "backend",
          "javascript",
          "node.js",
          "database",
          "api",
          "git",
        ],
      },
      {
        career: "Data Engineer",
        category: "Technical Skills",
        requiredSkills: [
          "Data Pipelines",
          "ETL Processes",
          "Big Data Technologies",
          "SQL",
          "Data Warehousing",
        ],
        keywords: [
          "data",
          "etl",
          "pipeline",
          "hadoop",
          "spark",
          "sql",
          "nosql",
          "database",
          "warehouse",
        ],
      },
      {
        career: "Cloud Architect",
        category: "Technical Skills",
        requiredSkills: [
          "Cloud Platforms",
          "System Design",
          "Network Architecture",
          "Security",
          "Scalability",
        ],
        keywords: [
          "cloud",
          "aws",
          "azure",
          "gcp",
          "architecture",
          "infrastructure",
          "network",
          "security",
        ],
      },

      // Soft Skills careers
      {
        career: "Project Coordinator",
        category: "Soft Skills",
        requiredSkills: [
          "Communication",
          "Teamwork",
          "Time Management",
          "Problem Solving",
          "Organization",
        ],
        keywords: [
          "communication",
          "team",
          "time management",
          "organization",
          "coordination",
          "planning",
        ],
      },
      {
        career: "Customer Success Manager",
        category: "Soft Skills",
        requiredSkills: [
          "Communication",
          "Emotional Intelligence",
          "Problem Solving",
          "Empathy",
          "Client Relationship",
        ],
        keywords: [
          "communication",
          "customer",
          "client",
          "relationship",
          "empathy",
          "emotional intelligence",
        ],
      },
      {
        career: "HR Specialist",
        category: "Soft Skills",
        requiredSkills: [
          "Communication",
          "Empathy",
          "Conflict Resolution",
          "Cultural Awareness",
          "Recruitment",
        ],
        keywords: [
          "hr",
          "human resources",
          "communication",
          "empathy",
          "conflict",
          "culture",
          "recruitment",
        ],
      },
      {
        career: "Communications Specialist",
        category: "Soft Skills",
        requiredSkills: [
          "Written Communication",
          "Public Speaking",
          "Media Relations",
          "Content Creation",
          "Storytelling",
        ],
        keywords: [
          "communication",
          "writing",
          "speaking",
          "media",
          "content",
          "story",
          "pr",
          "public relations",
        ],
      },

      // Management careers
      {
        career: "Project Manager",
        category: "Management Skills",
        requiredSkills: [
          "Project Management",
          "Team Leadership",
          "Risk Management",
          "Stakeholder Management",
          "Planning",
        ],
        keywords: [
          "project",
          "management",
          "leadership",
          "risk",
          "stakeholder",
          "planning",
          "agile",
          "scrum",
        ],
      },
      {
        career: "Product Manager",
        category: "Management Skills",
        requiredSkills: [
          "Strategic Planning",
          "Decision Making",
          "Stakeholder Management",
          "Agile Methodologies",
          "Market Analysis",
        ],
        keywords: [
          "product",
          "strategy",
          "decision",
          "stakeholder",
          "agile",
          "market",
          "roadmap",
        ],
      },
      {
        career: "Operations Manager",
        category: "Management Skills",
        requiredSkills: [
          "Process Improvement",
          "Resource Allocation",
          "Budget Management",
          "Team Leadership",
          "Strategic Planning",
        ],
        keywords: [
          "operations",
          "process",
          "resource",
          "budget",
          "leadership",
          "strategy",
          "efficiency",
        ],
      },
      {
        career: "Program Manager",
        category: "Management Skills",
        requiredSkills: [
          "Program Management",
          "Project Portfolio Management",
          "Strategic Alignment",
          "Resource Optimization",
          "Leadership",
        ],
        keywords: [
          "program",
          "portfolio",
          "strategy",
          "resource",
          "leadership",
          "coordination",
        ],
      },

      // Analytical careers
      {
        career: "Business Analyst",
        category: "Analytical Skills",
        requiredSkills: [
          "Data Analysis",
          "Business Intelligence",
          "Process Analysis",
          "Research",
          "Requirements Gathering",
        ],
        keywords: [
          "analysis",
          "business",
          "intelligence",
          "process",
          "research",
          "requirements",
        ],
      },
      {
        career: "Data Analyst",
        category: "Analytical Skills",
        requiredSkills: [
          "Data Analysis",
          "Statistical Analysis",
          "Data Visualization",
          "SQL",
          "Reporting",
        ],
        keywords: [
          "data",
          "statistics",
          "visualization",
          "sql",
          "reporting",
          "excel",
          "tableau",
          "power bi",
        ],
      },
      {
        career: "Market Research Analyst",
        category: "Analytical Skills",
        requiredSkills: [
          "Market Analysis",
          "Research",
          "Data Analysis",
          "Statistical Analysis",
          "Trend Identification",
        ],
        keywords: [
          "market",
          "research",
          "analysis",
          "statistics",
          "trends",
          "consumer",
          "survey",
        ],
      },
      {
        career: "Financial Analyst",
        category: "Analytical Skills",
        requiredSkills: [
          "Financial Analysis",
          "Financial Modeling",
          "Forecasting",
          "Budgeting",
          "Investment Analysis",
        ],
        keywords: [
          "financial",
          "finance",
          "model",
          "forecast",
          "budget",
          "investment",
          "accounting",
        ],
      },

      // Creative careers
      {
        career: "UX/UI Designer",
        category: "Creative Skills",
        requiredSkills: [
          "UX/UI Design",
          "Graphic Design",
          "User Research",
          "Prototyping",
          "Wireframing",
        ],
        keywords: [
          "ux",
          "ui",
          "design",
          "user",
          "research",
          "prototype",
          "wireframe",
          "figma",
          "sketch",
        ],
      },
      {
        career: "Graphic Designer",
        category: "Creative Skills",
        requiredSkills: [
          "Graphic Design",
          "Illustration",
          "Digital Art",
          "Brand Development",
          "Typography",
        ],
        keywords: [
          "graphic",
          "design",
          "illustration",
          "art",
          "brand",
          "typography",
          "adobe",
          "photoshop",
          "illustrator",
        ],
      },
      {
        career: "Content Creator",
        category: "Creative Skills",
        requiredSkills: [
          "Content Creation",
          "Creative Writing",
          "Copywriting",
          "Visual Storytelling",
          "Social Media",
        ],
        keywords: [
          "content",
          "writing",
          "copy",
          "story",
          "social media",
          "blog",
          "video",
          "creative",
        ],
      },
      {
        career: "Art Director",
        category: "Creative Skills",
        requiredSkills: [
          "Art Direction",
          "Visual Design",
          "Brand Identity",
          "Creative Direction",
          "Team Leadership",
        ],
        keywords: [
          "art",
          "direction",
          "visual",
          "brand",
          "creative",
          "leadership",
          "design",
        ],
      },

      // Domain Knowledge careers
      {
        career: "Industry Specialist",
        category: "Domain Knowledge",
        requiredSkills: [
          "Domain Expertise",
          "Industry Knowledge",
          "Business Acumen",
          "Specialized Skills",
          "Trend Analysis",
        ],
        keywords: [
          "industry",
          "domain",
          "business",
          "specialized",
          "trends",
          "expertise",
        ],
      },
      {
        career: "Consultant",
        category: "Domain Knowledge",
        requiredSkills: [
          "Domain Knowledge",
          "Problem Solving",
          "Communication",
          "Strategic Thinking",
          "Analysis",
        ],
        keywords: [
          "consultant",
          "domain",
          "problem",
          "communication",
          "strategy",
          "analysis",
          "advisory",
        ],
      },
    ];

    // Get all user skills as lowercase for matching
    const userSkillsLower = skills.map((skill) => skill.name.toLowerCase());

    // Get strong skills (score >= 4)
    const strongSkills = skills.filter((skill) => skill.score >= 4);
    const strongSkillsLower = strongSkills.map((skill) =>
      skill.name.toLowerCase(),
    );

    // Calculate match scores for each career
    const careerMatches = careerDatabase.map((career) => {
      // Calculate keyword match score
      let keywordMatches = 0;
      career.keywords.forEach((keyword) => {
        if (
          userSkillsLower.some(
            (skill) => skill.includes(keyword) || keyword.includes(skill),
          )
        ) {
          keywordMatches++;
        }
      });
      const keywordMatchScore = keywordMatches / career.keywords.length;

      // Calculate required skills match score
      let requiredSkillMatches = 0;
      career.requiredSkills.forEach((requiredSkill) => {
        const requiredSkillLower = requiredSkill.toLowerCase();
        if (
          strongSkillsLower.some(
            (skill) =>
              skill.includes(requiredSkillLower) ||
              requiredSkillLower.includes(skill),
          )
        ) {
          requiredSkillMatches++;
        }
      });
      const requiredSkillMatchScore =
        requiredSkillMatches / career.requiredSkills.length;

      // Calculate category match score
      // Find the user's skill count by category
      const userSkillsByCategory: Record<string, number> = {};
      skills.forEach((skill) => {
        userSkillsByCategory[skill.type] =
          (userSkillsByCategory[skill.type] || 0) + 1;
      });

      // Find the user's strongest category
      let strongestCategory = "";
      let maxSkillCount = 0;
      Object.entries(userSkillsByCategory).forEach(([category, count]) => {
        if (count > maxSkillCount) {
          maxSkillCount = count;
          strongestCategory = category;
        }
      });

      // Calculate category match (1 if matches, 0.5 if not)
      const categoryMatchScore =
        career.category === strongestCategory ? 1 : 0.5;

      // Calculate final match percentage (weighted average)
      const matchPercentage = Math.round(
        (keywordMatchScore * 0.4 +
          requiredSkillMatchScore * 0.4 +
          categoryMatchScore * 0.2) *
          100,
      );

      return {
        career: career.career,
        matchPercentage: matchPercentage,
        requiredSkills: career.requiredSkills,
      };
    });

    // Sort by match percentage and take top 5
    return careerMatches
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);
  };

  // Get learning resources for a skill
  const getLearningResource = (
    skillName: string,
    skillType: string,
  ): { resourceType: string; link: string } => {
    // Map of skills to specific learning resources
    const skillToResourceMap: Record<
      string,
      { resourceType: string; link: string }
    > = {
      // Technical Skills
      JavaScript: {
        resourceType: "Interactive Course",
        link: "https://www.w3schools.com/js/default.asp",
      },
      "Python Programming": {
        resourceType: "Online Course",
        link: "https://www.udemy.com/course/complete-python-bootcamp/",
      },
      "HTML/CSS": {
        resourceType: "Tutorial",
        link: "https://www.w3schools.com/html/",
      },
      React: { resourceType: "Documentation", link: "https://react.dev/learn" },
      Angular: {
        resourceType: "Tutorial",
        link: "https://angular.io/tutorial",
      },
      "Vue.js": {
        resourceType: "Guide",
        link: "https://vuejs.org/guide/introduction.html",
      },
      "Node.js": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/",
      },
      SQL: {
        resourceType: "Interactive Learning",
        link: "https://www.w3schools.com/sql/",
      },
      "Data Analysis": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/data-analysis-with-pandas/",
      },
      "Machine Learning": {
        resourceType: "Course",
        link: "https://www.coursera.org/learn/machine-learning",
      },
      "Web Development": {
        resourceType: "Bootcamp",
        link: "https://www.udemy.com/course/the-web-developer-bootcamp/",
      },
      "Mobile App Development": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/react-native-the-practical-guide/",
      },
      "Cloud Computing": {
        resourceType: "Learning Path",
        link: "https://aws.amazon.com/training/learn-about/",
      },
      DevOps: {
        resourceType: "Course",
        link: "https://www.udemy.com/course/devops-beginners-to-advanced/",
      },
      Cybersecurity: {
        resourceType: "Course",
        link: "https://www.udemy.com/course/network-security-course/",
      },
      "Data Science": {
        resourceType: "Specialization",
        link: "https://www.coursera.org/specializations/data-science",
      },
      "UI/UX Design": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/ui-ux-web-design-using-adobe-xd/",
      },
      Git: { resourceType: "Tutorial", link: "https://www.w3schools.com/git/" },
      Docker: {
        resourceType: "Course",
        link: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/",
      },
      Kubernetes: {
        resourceType: "Tutorial",
        link: "https://kubernetes.io/docs/tutorials/",
      },

      // Soft Skills
      Communication: {
        resourceType: "Course",
        link: "https://www.udemy.com/course/communication-skills-for-beginners/",
      },
      Leadership: {
        resourceType: "Course",
        link: "https://www.coursera.org/learn/leadership-skills",
      },
      Teamwork: {
        resourceType: "Guide",
        link: "https://www.mindtools.com/pages/article/newTMM_53.htm",
      },
      "Time Management": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/productivity-and-time-management-for-the-overwhelmed/",
      },
      "Problem Solving": {
        resourceType: "Guide",
        link: "https://www.mindtools.com/pages/article/newTMC_00.htm",
      },
      "Critical Thinking": {
        resourceType: "Course",
        link: "https://www.coursera.org/learn/critical-thinking-skills",
      },
      "Emotional Intelligence": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/emotional-intelligence-eq-for-leadership-and-management/",
      },

      // Management Skills
      "Project Management": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/pmp-pmbok6-35-pdus/",
      },
      "Agile Methodologies": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/agile-fundamentals-scrum-kanban-lean/",
      },
      "Strategic Planning": {
        resourceType: "Guide",
        link: "https://www.mindtools.com/pages/article/newSTR_94.htm",
      },
      "Risk Management": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/risk-management-for-business-and-projects/",
      },

      // Analytical Skills
      "Statistical Analysis": {
        resourceType: "Course",
        link: "https://www.coursera.org/learn/statistical-inference",
      },
      "Data Visualization": {
        resourceType: "Tutorial",
        link: "https://www.w3schools.com/datascience/ds_data_visualization.asp",
      },
      "Business Intelligence": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/microsoft-power-bi-up-running-with-power-bi-desktop/",
      },

      // Creative Skills
      "Graphic Design": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/graphic-design-masterclass/",
      },
      "Content Creation": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/content-marketing-2022/",
      },
      "UX/UI Design": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/ui-ux-web-design-using-adobe-xd/",
      },
      "Video Editing": {
        resourceType: "Course",
        link: "https://www.udemy.com/course/video-editing-in-premiere-pro-cc-for-beginners/",
      },
    };

    // Check if we have a specific resource for this skill
    if (skillName in skillToResourceMap) {
      return skillToResourceMap[skillName];
    }

    // Fallback resources by skill type if specific skill not found
    const fallbackResources: Record<
      string,
      { resourceType: string; link: string }[]
    > = {
      "Technical Skills": [
        { resourceType: "Web Development", link: "https://www.w3schools.com/" },
        {
          resourceType: "Programming Courses",
          link: "https://www.udemy.com/courses/development/programming-languages/",
        },
        {
          resourceType: "Tech Tutorials",
          link: "https://www.tutorialspoint.com/",
        },
      ],
      "Soft Skills": [
        {
          resourceType: "Communication Skills",
          link: "https://www.udemy.com/courses/business/communication/",
        },
        {
          resourceType: "Personal Development",
          link: "https://www.coursera.org/browse/personal-development",
        },
      ],
      "Management Skills": [
        {
          resourceType: "Project Management",
          link: "https://www.udemy.com/courses/business/project-management/",
        },
        {
          resourceType: "Leadership",
          link: "https://www.coursera.org/browse/business/leadership-and-management",
        },
      ],
      "Analytical Skills": [
        {
          resourceType: "Data Analysis",
          link: "https://www.udemy.com/courses/business/data-and-analytics/",
        },
        {
          resourceType: "Statistics",
          link: "https://www.khanacademy.org/math/statistics-probability",
        },
      ],
      "Creative Skills": [
        {
          resourceType: "Design",
          link: "https://www.udemy.com/courses/design/",
        },
        {
          resourceType: "Creative Software",
          link: "https://www.coursera.org/browse/arts-and-humanities/digital-media",
        },
      ],
      "Domain Knowledge": [
        {
          resourceType: "Industry Courses",
          link: "https://www.udemy.com/courses/business/",
        },
        {
          resourceType: "Specialized Knowledge",
          link: "https://www.coursera.org/browse",
        },
      ],
    };

    // Get resources for the skill type
    const resources =
      fallbackResources[skillType] || fallbackResources["Technical Skills"];

    // Select a resource based on the skill name (using a hash function for consistency)
    const hash = skillName
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const resourceIndex = hash % resources.length;

    return resources[resourceIndex];
  };

  // Calculate match percentage for career recommendations
  const calculateMatchPercentage = (
    requiredSkills: string[],
    userSkills: string[],
  ): number => {
    let matchCount = 0;

    requiredSkills.forEach((skill) => {
      // Check if the user has this skill or something similar
      if (
        userSkills.some(
          (userSkill) =>
            userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase()),
        )
      ) {
        matchCount++;
      }
    });

    return Math.round((matchCount / requiredSkills.length) * 100);
  };

  if (loading) {
    return (
      <div className="container flex min-h-[60vh] max-w-4xl items-center justify-center py-12">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Analyzing your skills...</h2>
          <Progress value={75} className="w-[300px]" />
          <p className="text-muted-foreground">
            Our AI model is processing your skill assessment
          </p>
        </div>
      </div>
    );
  }

  if (error || !results || !assessmentData) {
    return (
      <div className="container max-w-4xl py-12">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <h2 className="text-2xl font-semibold">Error</h2>
              <p className="text-muted-foreground">
                {error || "Failed to process assessment results."}
              </p>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/assessment">Take Assessment</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 space-y-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Assessment Results</h1>
        </div>
        <p className="text-muted-foreground">
          Based on your skills and proficiency levels, we've analyzed your
          profile and prepared personalized recommendations.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="learning">Learning Recommendations</TabsTrigger>
          <TabsTrigger value="careers">Career Paths</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Skill Summary */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    {assessmentData.skills.length}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Total Skills Assessed
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-500/10 p-3">
                    <Star className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    {results.strongSkills.length}
                  </h3>
                  <p className="text-sm text-muted-foreground">Strong Skills</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-amber-500/10 p-3">
                    <TrendingUp className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    {results.skillsToImprove.length}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Skills to Improve
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skill Proficiency by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Proficiency by Category</CardTitle>
              <CardDescription>
                Your skill proficiency scores across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(results.percentageScores).map(
                  ([category, score]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{category}</span>
                        <span>{score}%</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Your Top Skills</CardTitle>
              <CardDescription>
                Skills where you demonstrate high proficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.strongSkills.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {results.strongSkills.slice(0, 4).map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-start gap-3 rounded-lg border bg-card p-3"
                    >
                      <div className="mt-0.5">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{skill.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {skill.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No strong skills identified yet. Keep improving!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Career Recommendations Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Career Recommendations</CardTitle>
              <CardDescription>
                Based on your strongest skills, these career paths might be a
                good fit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.careerRecommendations.slice(0, 3).map((career) => (
                  <div
                    key={career.career}
                    className="flex items-center justify-between rounded-lg border bg-card p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span className="font-medium">{career.career}</span>
                    </div>
                    <Badge className="bg-primary">
                      {career.matchPercentage}% Match
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STRENGTHS TAB */}
        <TabsContent value="strengths" className="space-y-6">
          {/* Strong Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Your Strengths</CardTitle>
              <CardDescription>
                Skills where you demonstrate high proficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.strongSkills.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {results.strongSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-start gap-3 rounded-lg border bg-card p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{skill.name}</h3>
                        <div className="mt-1 flex items-center">
                          <p className="mr-2 text-sm text-muted-foreground">
                            {skill.type}
                          </p>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => {
                              if (i < Math.floor(skill.score)) {
                                return (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 fill-amber-500 text-amber-500"
                                  />
                                );
                              } else if (i < skill.score) {
                                return (
                                  <StarHalf
                                    key={i}
                                    className="h-3 w-3 fill-amber-500 text-amber-500"
                                  />
                                );
                              } else {
                                return (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 text-muted-foreground"
                                  />
                                );
                              }
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <BarChart className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No Strong Skills Yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    Continue developing your skills to reach advanced or expert
                    level proficiency.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skill Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Distribution</CardTitle>
              <CardDescription>
                Breakdown of your skills by category and proficiency level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Skill Categories */}
                <div>
                  <h3 className="mb-3 text-sm font-medium">
                    Skills by Category
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {Object.entries(
                      assessmentData.skills.reduce(
                        (acc, skill) => {
                          acc[skill.type] = (acc[skill.type] || 0) + 1;
                          return acc;
                        },
                        {} as Record<string, number>,
                      ),
                    ).map(([type, count]) => (
                      <div
                        key={type}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <span>{type}</span>
                        <Badge variant="outline">{count} skills</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proficiency Levels */}
                <div>
                  <h3 className="mb-3 text-sm font-medium">
                    Skills by Proficiency Level
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-green-600">
                          Expert (4.5-5)
                        </span>
                        <Badge
                          variant="outline"
                          className="border-green-500/30"
                        >
                          {
                            assessmentData.skills.filter((s) => s.score >= 4.5)
                              .length
                          }
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Skills where you have mastery
                      </p>
                    </div>
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-blue-600">
                          Advanced (3.5-4)
                        </span>
                        <Badge variant="outline" className="border-blue-500/30">
                          {
                            assessmentData.skills.filter(
                              (s) => s.score >= 3.5 && s.score < 4.5,
                            ).length
                          }
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Skills where you're highly proficient
                      </p>
                    </div>
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-amber-600">
                          Intermediate (2.5-3)
                        </span>
                        <Badge
                          variant="outline"
                          className="border-amber-500/30"
                        >
                          {
                            assessmentData.skills.filter(
                              (s) => s.score >= 2.5 && s.score < 3.5,
                            ).length
                          }
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Skills where you have good knowledge
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LEARNING RECOMMENDATIONS TAB */}
        <TabsContent value="learning" className="space-y-6">
          {/* Skills to Improve */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-amber-500/10 to-transparent">
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-amber-500" />
                Skills to Improve
              </CardTitle>
              <CardDescription>
                Skills where you have some proficiency but could benefit from
                additional training
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {results.skillsToImprove.length > 0 ? (
                <div className="space-y-4">
                  {results.skillsToImprove.map((skill) => {
                    const resource = getLearningResource(
                      skill.name,
                      skill.type,
                    );
                    return (
                      <Card key={skill.name} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-semibold">{skill.name}</h3>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => {
                                if (i < Math.floor(skill.score)) {
                                  return (
                                    <Star
                                      key={i}
                                      className="h-3 w-3 fill-amber-500 text-amber-500"
                                    />
                                  );
                                } else if (i < skill.score) {
                                  return (
                                    <StarHalf
                                      key={i}
                                      className="h-3 w-3 fill-amber-500 text-amber-500"
                                    />
                                  );
                                } else {
                                  return (
                                    <Star
                                      key={i}
                                      className="h-3 w-3 text-muted-foreground"
                                    />
                                  );
                                }
                              })}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Category: {skill.type}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <BookOpen className="mr-2 h-4 w-4 text-primary" />
                              <span className="text-sm">
                                {resource.resourceType}
                              </span>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={resource.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                Start Learning{" "}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="py-4 text-muted-foreground">
                  No skills in this category. Great job!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Learning Path */}
          <Card>
            <CardHeader>
              <CardTitle>Your Learning Path</CardTitle>
              <CardDescription>
                A structured approach to developing your skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative border-l-2 border-muted pb-8 pl-8">
                  <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary"></div>
                  <h3 className="font-semibold">Start with Fundamentals</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Begin by strengthening your foundation in these areas:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {results.skillsToImprove
                      .filter((s) => s.score < 3)
                      .slice(0, 2)
                      .map((skill) => (
                        <Badge key={skill.name} variant="outline">
                          {skill.name}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="relative border-l-2 border-muted pb-8 pl-8">
                  <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary"></div>
                  <h3 className="font-semibold">Improve Existing Skills</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Next, focus on enhancing your current skillset:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {results.skillsToImprove
                      .filter((s) => s.score >= 3)
                      .slice(0, 3)
                      .map((skill) => (
                        <Badge key={skill.name} variant="outline">
                          {skill.name}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary"></div>
                  <h3 className="font-semibold">Expand Your Skillset</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Finally, develop expertise in new areas:
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CAREER PATHS TAB */}
        <TabsContent value="careers" className="space-y-6">
          {/* Career Recommendations */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-primary" />
                Career Recommendations
              </CardTitle>
              <CardDescription>
                Based on your strongest skills, these career paths might be a
                good fit
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {results.careerRecommendations.map((career, index) => (
                  <Card
                    key={career.career}
                    className={`overflow-hidden ${index === 0 ? "border-primary" : ""}`}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          {career.career}
                        </h3>
                        <Badge
                          className={
                            index === 0 ? "bg-primary" : "bg-secondary"
                          }
                        >
                          {career.matchPercentage}% Match
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill Gap Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Gap Analysis</CardTitle>
              <CardDescription>
                Skills you should develop for your target careers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="mb-2 font-semibold">
                  Priority Skills to Develop
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Based on your career recommendations, here are the skills you
                  should prioritize:
                </p>

                <div className="space-y-3">
                  {results.careerRecommendations.flatMap((career) => {
                    // Find skills that are required but the user doesn't have
                    const missingRequiredSkills = career.requiredSkills.filter(
                      (skill) =>
                        !results.strongSkills.some(
                          (s) =>
                            s.name
                              .toLowerCase()
                              .includes(skill.toLowerCase()) ||
                            skill.toLowerCase().includes(s.name.toLowerCase()),
                        ),
                    );

                    return missingRequiredSkills.map((skill) => {
                      const resource = getLearningResource(
                        skill,
                        "Technical Skills",
                      );
                      return (
                        <div
                          key={`${career.career}-${skill}`}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-primary" />
                            <div>
                              <span className="font-medium">{skill}</span>
                              <p className="text-xs text-muted-foreground">
                                Required for: {career.career}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">High Priority</Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8"
                              asChild
                            >
                              <a
                                href={resource.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Growth Path */}
          <Card>
            <CardHeader>
              <CardTitle>Career Growth Path</CardTitle>
              <CardDescription>
                Steps to advance in your recommended career paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.careerRecommendations.length > 0 && (
                <div className="space-y-6">
                  <div className="relative border-l-2 border-muted pb-8 pl-8">
                    <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary"></div>
                    <h3 className="font-semibold">Entry Level</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Start with positions like{" "}
                      <span className="font-medium">
                        Junior {results.careerRecommendations[0].career}
                      </span>{" "}
                      to build experience.
                    </p>
                    <div className="mt-2">
                      <p className="text-sm">
                        Focus on developing these skills:
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {results.careerRecommendations[0].requiredSkills
                          .slice(0, 2)
                          .map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative border-l-2 border-muted pb-8 pl-8">
                    <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary"></div>
                    <h3 className="font-semibold">Mid-Level</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Progress to{" "}
                      <span className="font-medium">
                        {results.careerRecommendations[0].career}
                      </span>{" "}
                      roles with 2-3 years of experience.
                    </p>
                    <div className="mt-2">
                      <p className="text-sm">Enhance your expertise in:</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {results.careerRecommendations[0].requiredSkills
                          .slice(2)
                          .map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary"></div>
                    <h3 className="font-semibold">Senior Level</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Advance to{" "}
                      <span className="font-medium">
                        Senior {results.careerRecommendations[0].career}
                      </span>{" "}
                      or leadership positions.
                    </p>
                    <div className="mt-2">
                      <p className="text-sm">Develop additional skills like:</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Badge variant="outline">Team Leadership</Badge>
                        <Badge variant="outline">Strategic Planning</Badge>
                        <Badge variant="outline">Mentoring</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button asChild>
          <Link href="/skill-assessment">Take Another Assessment</Link>
        </Button>
      </div>
    </div>
  );
}
