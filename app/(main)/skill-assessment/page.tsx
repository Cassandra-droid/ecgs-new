"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

// Define skill types and their corresponding skills based on the dataset
const skillOptions = {
  "Technical Skills": [
    // Programming Languages
    "Python Programming",
    "JavaScript",
    "TypeScript",
    "Java",
    "C++",
    "C#",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "Go",
    "Rust",
    "Scala",
    "Perl",
    "R Programming",
    "MATLAB",
    "Dart",
    "Objective-C",
    "Assembly",
    "Groovy",
    "Lua",
    "Haskell",
    "Clojure",
    "Elixir",
    "F#",
    "COBOL",
    "Fortran",
    "Lisp",
    "Prolog",
    "Julia",

    // Web Development
    "HTML/CSS",
    "React",
    "Angular",
    "Vue.js",
    "Next.js",
    "Svelte",
    "jQuery",
    "Bootstrap",
    "Tailwind CSS",
    "Material UI",
    "Responsive Design",
    "Progressive Web Apps",
    "Web Accessibility",
    "Web Performance Optimization",
    "Web Components",
    "Server-Side Rendering",
    "Static Site Generation",
    "JAMstack",
    "Webpack",
    "Vite",
    "Babel",
    "ESLint",
    "Prettier",

    // Mobile Development
    "Mobile App Development",
    "React Native",
    "Flutter",
    "iOS Development",
    "Android Development",
    "Xamarin",
    "Ionic",
    "Cordova",
    "Mobile UI/UX",
    "App Store Optimization",
    "Mobile App Testing",
    "Mobile App Security",

    // Backend Development
    "Node.js",
    "Express.js",
    "Django",
    "Flask",
    "Ruby on Rails",
    "Spring Boot",
    "Laravel",
    "ASP.NET Core",
    "FastAPI",
    "NestJS",
    "GraphQL",
    "REST API Design",
    "API Documentation",
    "Microservices",
    "Serverless Architecture",
    "WebSockets",
    "gRPC",

    // Database
    "SQL",
    "NoSQL",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "SQLite",
    "Oracle Database",
    "Microsoft SQL Server",
    "Redis",
    "Cassandra",
    "DynamoDB",
    "Firebase",
    "Elasticsearch",
    "Neo4j",
    "Database Design",
    "Database Optimization",
    "ORM",
    "Database Migration",

    // DevOps & Cloud
    "DevOps",
    "Cloud Computing",
    "AWS",
    "Azure",
    "Google Cloud Platform",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Ansible",
    "Jenkins",
    "CI/CD",
    "Infrastructure as Code",
    "Cloud Architecture",
    "Serverless Computing",
    "Containerization",
    "Virtualization",
    "Load Balancing",
    "Auto Scaling",
    "Service Mesh",

    // Version Control
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "Version Control",
    "Branching Strategies",
    "Code Review",

    // Security
    "Cybersecurity",
    "Network Security",
    "Application Security",
    "Penetration Testing",
    "Vulnerability Assessment",
    "Security Auditing",
    "Encryption",
    "Authentication",
    "Authorization",
    "OAuth",
    "JWT",
    "SAML",
    "OWASP",
    "Secure Coding Practices",

    // Data Science & AI
    "Data Analysis",
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Reinforcement Learning",
    "Data Mining",
    "Big Data",
    "Data Visualization",
    "Statistical Analysis",
    "Predictive Modeling",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "Keras",
    "Data Preprocessing",
    "Feature Engineering",
    "Model Deployment",

    // Blockchain
    "Blockchain",
    "Smart Contracts",
    "Ethereum",
    "Solidity",
    "Web3",
    "Cryptocurrency",
    "Distributed Ledger Technology",

    // Other Technical Skills
    "System Design",
    "Software Architecture",
    "Algorithms",
    "Data Structures",
    "Design Patterns",
    "Testing",
    "Unit Testing",
    "Integration Testing",
    "Test-Driven Development",
    "Debugging",
    "Performance Optimization",
    "Refactoring",
    "Code Documentation",
    "Technical Writing",
    "Problem Solving",
    "Computational Thinking",
    "Network Administration",
    "System Administration",
    "Linux",
    "Unix",
    "Windows Server",
    "Shell Scripting",
    "Bash",
    "PowerShell",
    "RESTful APIs",
    "SOAP APIs",
    "WebRTC",
    "IoT Development",
    "Embedded Systems",
    "Game Development",
    "Unity",
    "Unreal Engine",
    "Augmented Reality",
    "Virtual Reality",
    "3D Modeling",
  ],
  "Soft Skills": [
    // Communication
    "Communication",
    "Verbal Communication",
    "Written Communication",
    "Public Speaking",
    "Presentation Skills",
    "Active Listening",
    "Interpersonal Communication",
    "Storytelling",
    "Technical Communication",
    "Business Communication",
    "Cross-cultural Communication",
    "Persuasive Communication",
    "Diplomatic Communication",
    "Feedback Delivery",
    "Nonverbal Communication",
    "Email Communication",
    "Meeting Facilitation",

    // Collaboration
    "Teamwork",
    "Collaboration",
    "Team Building",
    "Relationship Building",
    "Conflict Resolution",
    "Negotiation",
    "Mediation",
    "Consensus Building",
    "Networking",
    "Partnership Development",
    "Cross-functional Collaboration",
    "Remote Collaboration",
    "Virtual Team Management",
    "Group Facilitation",
    "Stakeholder Management",

    // Thinking Skills
    "Critical Thinking",
    "Analytical Thinking",
    "Strategic Thinking",
    "Systems Thinking",
    "Design Thinking",
    "Creative Thinking",
    "Problem Solving",
    "Decision Making",
    "Logical Reasoning",
    "Conceptual Thinking",
    "Innovative Thinking",
    "Lateral Thinking",
    "Divergent Thinking",
    "Convergent Thinking",
    "Computational Thinking",

    // Personal Effectiveness
    "Time Management",
    "Organization",
    "Prioritization",
    "Goal Setting",
    "Self-motivation",
    "Self-discipline",
    "Self-awareness",
    "Stress Management",
    "Work-Life Balance",
    "Adaptability",
    "Flexibility",
    "Resilience",
    "Perseverance",
    "Attention to Detail",
    "Focus",
    "Mindfulness",
    "Continuous Learning",
    "Growth Mindset",
    "Initiative",
    "Proactivity",
    "Accountability",
    "Responsibility",
    "Reliability",
    "Punctuality",

    // Emotional Intelligence
    "Emotional Intelligence",
    "Empathy",
    "Self-regulation",
    "Social Awareness",
    "Relationship Management",
    "Emotional Awareness",
    "Compassion",
    "Patience",
    "Cultural Sensitivity",
    "Diversity Awareness",
    "Inclusion",
    "Psychological Safety",

    // Leadership
    "Leadership",
    "Influence",
    "Motivation",
    "Delegation",
    "Coaching",
    "Mentoring",
    "Feedback Reception",
    "Inspirational Leadership",
    "Servant Leadership",
    "Transformational Leadership",
    "Situational Leadership",
    "Ethical Leadership",
    "Vision Setting",
    "Strategic Leadership",

    // Professional Skills
    "Professionalism",
    "Business Etiquette",
    "Customer Service",
    "Client Relationship Management",
    "Diplomacy",
    "Discretion",
    "Confidentiality",
    "Ethics",
    "Integrity",
    "Honesty",
    "Transparency",
    "Workplace Etiquette",
    "Professional Appearance",
    "Personal Branding",

    // Other Soft Skills
    "Creativity",
    "Innovation",
    "Curiosity",
    "Open-mindedness",
    "Persuasion",
    "Influence Without Authority",
    "Assertiveness",
    "Confidence",
    "Humility",
    "Optimism",
    "Enthusiasm",
    "Sense of Humor",
    "Work Ethic",
    "Grit",
    "Resourcefulness",
    "Cultural Awareness",
    "Global Mindset",
  ],
  "Management Skills": [
    // Project Management
    "Project Management",
    "Program Management",
    "Portfolio Management",
    "Agile Methodologies",
    "Scrum",
    "Kanban",
    "Lean Management",
    "Waterfall Methodology",
    "Prince2",
    "PMBOK",
    "Project Planning",
    "Project Scheduling",
    "Project Budgeting",
    "Project Execution",
    "Project Monitoring",
    "Project Closure",
    "Project Documentation",
    "Requirements Gathering",
    "Scope Management",
    "Risk Management",
    "Issue Management",
    "Change Management",
    "Quality Management",
    "Resource Management",
    "Stakeholder Management",
    "Project Governance",
    "Project Recovery",
    "Earned Value Management",
    "Critical Path Method",
    "Gantt Charts",
    "Project Management Tools",
    "MS Project",
    "Jira",
    "Asana",
    "Trello",
    "Monday.com",
    "ClickUp",

    // People Management
    "Team Leadership",
    "People Management",
    "Team Building",
    "Team Development",
    "Performance Management",
    "Performance Evaluation",
    "Talent Development",
    "Succession Planning",
    "Recruitment",
    "Interviewing",
    "Onboarding",
    "Training",
    "Coaching",
    "Mentoring",
    "Employee Engagement",
    "Employee Retention",
    "Conflict Management",
    "Difficult Conversations",
    "Feedback Delivery",
    "Recognition",
    "Motivation",
    "Delegation",
    "Remote Team Management",
    "Virtual Team Leadership",
    "Cross-cultural Team Management",
    "Diversity Management",
    "Inclusion Practices",

    // Strategic Management
    "Strategic Planning",
    "Strategic Thinking",
    "Vision Development",
    "Mission Setting",
    "Goal Setting",
    "OKR Implementation",
    "KPI Development",
    "Business Strategy",
    "Competitive Analysis",
    "Market Analysis",
    "SWOT Analysis",
    "PESTEL Analysis",
    "Porter's Five Forces",
    "Blue Ocean Strategy",
    "Business Model Canvas",
    "Value Chain Analysis",
    "Scenario Planning",
    "Strategic Foresight",
    "Decision Making",
    "Problem Solving",
    "Critical Thinking",

    // Operational Management
    "Operations Management",
    "Process Improvement",
    "Process Mapping",
    "Business Process Reengineering",
    "Six Sigma",
    "Lean Six Sigma",
    "Total Quality Management",
    "Continuous Improvement",
    "Kaizen",
    "5S Methodology",
    "Root Cause Analysis",
    "Bottleneck Analysis",
    "Capacity Planning",
    "Resource Allocation",
    "Supply Chain Management",
    "Inventory Management",
    "Logistics Management",
    "Vendor Management",
    "Contract Management",
    "Service Level Agreements",
    "Quality Assurance",
    "Quality Control",

    // Financial Management
    "Budget Management",
    "Financial Planning",
    "Cost Management",
    "Cost-Benefit Analysis",
    "ROI Analysis",
    "Financial Forecasting",
    "Financial Reporting",
    "Financial Analysis",
    "Profit & Loss Management",
    "Revenue Management",
    "Expense Management",
    "Capital Expenditure Planning",
    "Financial Risk Management",
    "Financial Decision Making",

    // Change Management
    "Change Management",
    "Organizational Change",
    "Change Leadership",
    "Transformation Management",
    "Digital Transformation",
    "Cultural Transformation",
    "Change Communication",
    "Change Readiness Assessment",
    "Resistance Management",
    "Stakeholder Engagement",
    "Change Adoption",
    "Change Sustainability",

    // Risk Management
    "Risk Management",
    "Risk Assessment",
    "Risk Identification",
    "Risk Analysis",
    "Risk Mitigation",
    "Risk Monitoring",
    "Contingency Planning",
    "Business Continuity Planning",
    "Crisis Management",
    "Disaster Recovery",
    "Compliance Management",
    "Regulatory Compliance",

    // Other Management Skills
    "Meeting Management",
    "Facilitation",
    "Presentation Skills",
    "Reporting",
    "Business Case Development",
    "Negotiation",
    "Conflict Resolution",
    "Time Management",
    "Prioritization",
    "Delegation",
    "Decision Making",
    "Problem Solving",
    "Critical Thinking",
    "Systems Thinking",
    "Design Thinking",
    "Innovation Management",
    "Knowledge Management",
    "Information Management",
  ],
  "Analytical Skills": [
    // Data Analysis
    "Data Analysis",
    "Statistical Analysis",
    "Descriptive Statistics",
    "Inferential Statistics",
    "Hypothesis Testing",
    "A/B Testing",
    "Multivariate Testing",
    "Regression Analysis",
    "Correlation Analysis",
    "Factor Analysis",
    "Cluster Analysis",
    "Time Series Analysis",
    "Cohort Analysis",
    "Funnel Analysis",
    "Segmentation Analysis",
    "RFM Analysis",
    "Churn Analysis",
    "Customer Lifetime Value Analysis",
    "Predictive Analytics",
    "Prescriptive Analytics",
    "Diagnostic Analytics",
    "Data Mining",
    "Text Mining",
    "Web Analytics",
    "Social Media Analytics",
    "Marketing Analytics",
    "Sales Analytics",
    "Financial Analytics",
    "HR Analytics",
    "Supply Chain Analytics",
    "Operations Analytics",

    // Data Visualization
    "Data Visualization",
    "Dashboard Creation",
    "Chart Design",
    "Infographic Design",
    "Interactive Visualization",
    "Tableau",
    "Power BI",
    "Looker",
    "Google Data Studio",
    "D3.js",
    "Matplotlib",
    "Seaborn",
    "ggplot2",
    "Plotly",

    // Research
    "Research",
    "Market Research",
    "User Research",
    "Competitive Research",
    "Academic Research",
    "Scientific Research",
    "Qualitative Research",
    "Quantitative Research",
    "Mixed Methods Research",
    "Survey Design",
    "Questionnaire Development",
    "Interview Techniques",
    "Focus Group Moderation",
    "Ethnographic Research",
    "Observational Research",
    "Experimental Design",
    "Literature Review",
    "Systematic Review",
    "Meta-analysis",
    "Research Methodology",
    "Research Ethics",

    // Business Analysis
    "Business Analysis",
    "Requirements Analysis",
    "Process Analysis",
    "Gap Analysis",
    "Root Cause Analysis",
    "Cost-Benefit Analysis",
    "SWOT Analysis",
    "PESTEL Analysis",
    "Porter's Five Forces",
    "Value Chain Analysis",
    "Business Process Modeling",
    "Use Case Development",
    "User Story Creation",
    "Functional Specification",
    "Technical Specification",
    "Business Requirements Documentation",
    "Stakeholder Analysis",
    "Impact Analysis",
    "Feasibility Study",
    "Business Case Development",

    // Financial Analysis
    "Financial Analysis",
    "Financial Modeling",
    "Financial Forecasting",
    "Budget Analysis",
    "Cost Analysis",
    "Profitability Analysis",
    "Cash Flow Analysis",
    "Ratio Analysis",
    "Variance Analysis",
    "Trend Analysis",
    "Sensitivity Analysis",
    "Scenario Analysis",
    "Monte Carlo Simulation",
    "Discounted Cash Flow Analysis",
    "Net Present Value Calculation",
    "Internal Rate of Return Calculation",
    "Return on Investment Analysis",
    "Break-even Analysis",
    "Valuation",

    // Quantitative Analysis
    "Quantitative Analysis",
    "Mathematical Modeling",
    "Optimization",
    "Linear Programming",
    "Integer Programming",
    "Dynamic Programming",
    "Game Theory",
    "Decision Theory",
    "Queueing Theory",
    "Simulation",
    "Numerical Analysis",
    "Calculus",
    "Linear Algebra",
    "Probability Theory",
    "Statistical Inference",
    "Econometrics",
    "Operations Research",

    // Qualitative Analysis
    "Qualitative Analysis",
    "Content Analysis",
    "Discourse Analysis",
    "Narrative Analysis",
    "Phenomenological Analysis",
    "Grounded Theory",
    "Thematic Analysis",
    "Framework Analysis",
    "Interpretative Phenomenological Analysis",
    "Qualitative Comparative Analysis",

    // Critical Thinking
    "Critical Thinking",
    "Analytical Thinking",
    "Logical Reasoning",
    "Deductive Reasoning",
    "Inductive Reasoning",
    "Abductive Reasoning",
    "Problem Solving",
    "Decision Making",
    "Evaluative Judgment",
    "Argument Analysis",
    "Fallacy Identification",
    "Evidence Evaluation",
    "Fact Checking",
    "Information Literacy",
    "Media Literacy",
    "Data Literacy",

    // Tools & Technologies
    "SQL",
    "Excel",
    "Python for Data Analysis",
    "R Programming",
    "SPSS",
    "SAS",
    "STATA",
    "MATLAB",
    "Pandas",
    "NumPy",
    "SciPy",
    "Scikit-learn",
    "TensorFlow",
    "PyTorch",
    "Keras",
    "Hadoop",
    "Spark",
    "Hive",
    "Pig",
    "MongoDB",
    "Cassandra",
    "Neo4j",
    "Elasticsearch",

    // Other Analytical Skills
    "Pattern Recognition",
    "Anomaly Detection",
    "Forecasting",
    "Benchmarking",
    "Competitive Intelligence",
    "Business Intelligence",
    "Data Governance",
    "Data Quality Management",
    "Metadata Management",
    "Data Modeling",
    "Database Design",
    "ETL Processes",
    "Data Warehousing",
    "Data Lake Architecture",
    "Big Data Technologies",
    "Cloud Computing for Analytics",
  ],
  "Creative Skills": [
    // Design
    "Graphic Design",
    "Web Design",
    "UI Design",
    "UX Design",
    "Interaction Design",
    "Visual Design",
    "Product Design",
    "Industrial Design",
    "Fashion Design",
    "Interior Design",
    "Architectural Design",
    "Game Design",
    "Character Design",
    "Environment Design",
    "Level Design",
    "Logo Design",
    "Brand Identity Design",
    "Packaging Design",
    "Print Design",
    "Editorial Design",
    "Typography",
    "Color Theory",
    "Layout Design",
    "Information Design",
    "Infographic Design",
    "Icon Design",
    "Illustration",
    "Digital Illustration",
    "Vector Illustration",
    "Concept Art",
    "Storyboarding",
    "Wireframing",
    "Prototyping",
    "3D Modeling",
    "3D Animation",
    "CAD Design",
    "Parametric Design",
    "Generative Design",

    // Visual Arts
    "Drawing",
    "Painting",
    "Sketching",
    "Portraiture",
    "Figure Drawing",
    "Landscape Painting",
    "Still Life",
    "Abstract Art",
    "Mixed Media",
    "Collage",
    "Printmaking",
    "Sculpture",
    "Ceramics",
    "Pottery",
    "Jewelry Making",
    "Textile Art",
    "Fiber Arts",
    "Weaving",
    "Knitting",
    "Embroidery",
    "Calligraphy",
    "Lettering",

    // Digital Media
    "Digital Art",
    "Digital Painting",
    "Photo Manipulation",
    "Compositing",
    "Retouching",
    "Photography",
    "Portrait Photography",
    "Landscape Photography",
    "Product Photography",
    "Food Photography",
    "Fashion Photography",
    "Architectural Photography",
    "Street Photography",
    "Documentary Photography",
    "Photojournalism",
    "Studio Lighting",
    "Photo Editing",
    "Videography",
    "Cinematography",
    "Video Editing",
    "Color Grading",
    "Motion Graphics",
    "Animation",
    "2D Animation",
    "3D Animation",
    "Stop Motion Animation",
    "Character Animation",
    "VFX",
    "Compositing",
    "Rotoscoping",
    "Chroma Keying",

    // Writing & Content Creation
    "Creative Writing",
    "Fiction Writing",
    "Non-fiction Writing",
    "Poetry",
    "Screenwriting",
    "Playwriting",
    "Copywriting",
    "Content Writing",
    "Technical Writing",
    "Blog Writing",
    "Article Writing",
    "SEO Writing",
    "UX Writing",
    "Editing",
    "Proofreading",
    "Storytelling",
    "Narrative Design",
    "Content Strategy",
    "Content Planning",
    "Content Curation",
    "Social Media Content Creation",
    "Email Marketing Content",
    "Podcast Production",
    "Audio Production",
    "Voice Acting",
    "Narration",

    // Music & Audio
    "Music Composition",
    "Songwriting",
    "Music Production",
    "Beat Making",
    "Sound Design",
    "Foley Art",
    "Audio Engineering",
    "Mixing",
    "Mastering",
    "Vocal Production",
    "Instrumental Performance",
    "Singing",
    "Music Theory",
    "DJ Skills",
    "Music Arrangement",
    "Orchestration",
    "Film Scoring",
    "Game Audio",

    // Performing Arts
    "Acting",
    "Directing",
    "Theater Production",
    "Dance",
    "Choreography",
    "Public Speaking",
    "Presentation Skills",
    "Improvisation",
    "Stand-up Comedy",
    "Puppetry",
    "Mime",
    "Physical Theater",

    // Creative Thinking
    "Creativity",
    "Ideation",
    "Brainstorming",
    "Design Thinking",
    "Lateral Thinking",
    "Divergent Thinking",
    "Convergent Thinking",
    "Creative Problem Solving",
    "Conceptual Thinking",
    "Visual Thinking",
    "Spatial Reasoning",
    "Pattern Recognition",
    "Aesthetic Judgment",
    "Artistic Vision",
    "Trend Forecasting",
    "Cultural Awareness",

    // Tools & Software
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Adobe InDesign",
    "Adobe XD",
    "Adobe Premiere Pro",
    "Adobe After Effects",
    "Adobe Lightroom",
    "Adobe Audition",
    "Sketch",
    "Figma",
    "InVision",
    "Procreate",
    "Blender",
    "Maya",
    "Cinema 4D",
    "ZBrush",
    "Substance Painter",
    "Unity",
    "Unreal Engine",
    "Final Cut Pro",
    "DaVinci Resolve",
    "Logic Pro",
    "Ableton Live",
    "Pro Tools",
    "FL Studio",

    // Other Creative Skills
    "Brand Development",
    "Visual Storytelling",
    "Art Direction",
    "Creative Direction",
    "Production Management",
    "Project Management for Creative Projects",
    "Client Presentation",
    "Portfolio Development",
    "Creative Collaboration",
    "Interdisciplinary Thinking",
    "Experimental Design",
    "Prototyping",
    "User Testing",
    "Usability Testing",
    "Accessibility Design",
    "Inclusive Design",
    "Sustainable Design",
    "Design Ethics",
  ],
  "Domain Knowledge": [
    // Healthcare & Life Sciences
    "Healthcare",
    "Medicine",
    "Nursing",
    "Pharmacy",
    "Public Health",
    "Epidemiology",
    "Biostatistics",
    "Health Informatics",
    "Electronic Health Records",
    "Healthcare Administration",
    "Healthcare Policy",
    "Healthcare Compliance",
    "HIPAA",
    "Clinical Research",
    "Pharmaceutical Research",
    "Drug Development",
    "Clinical Trials",
    "Biotechnology",
    "Genomics",
    "Proteomics",
    "Bioinformatics",
    "Molecular Biology",
    "Cell Biology",
    "Immunology",
    "Microbiology",
    "Neuroscience",
    "Physiology",
    "Anatomy",
    "Pathology",
    "Histology",
    "Toxicology",
    "Pharmacology",
    "Medical Devices",
    "Telemedicine",
    "Digital Health",
    "Health Insurance",
    "Managed Care",
    "Medicare",
    "Medicaid",
    "Mental Health",
    "Psychology",
    "Psychiatry",
    "Therapy",
    "Counseling",
    "Veterinary Medicine",
    "Animal Health",

    // Finance & Banking
    "Finance",
    "Banking",
    "Investment Banking",
    "Commercial Banking",
    "Retail Banking",
    "Private Banking",
    "Corporate Finance",
    "Financial Analysis",
    "Financial Modeling",
    "Financial Planning",
    "Financial Reporting",
    "Financial Statements",
    "Accounting",
    "Bookkeeping",
    "Auditing",
    "Tax",
    "Investment Management",
    "Asset Management",
    "Wealth Management",
    "Portfolio Management",
    "Risk Management",
    "Credit Risk",
    "Market Risk",
    "Operational Risk",
    "Insurance",
    "Underwriting",
    "Actuarial Science",
    "Claims Management",
    "Reinsurance",
    "Capital Markets",
    "Equity Markets",
    "Fixed Income",
    "Derivatives",
    "Commodities",
    "Foreign Exchange",
    "Securities",
    "Trading",
    "Algorithmic Trading",
    "Quantitative Finance",
    "Financial Regulations",
    "Compliance",
    "Anti-Money Laundering",
    "Know Your Customer",
    "Sarbanes-Oxley",
    "Basel Accords",
    "IFRS",
    "GAAP",
    "Blockchain in Finance",
    "Cryptocurrency",
    "Fintech",
    "Payment Systems",
    "Real Estate Finance",
    "Mortgage Lending",

    // Education
    "Education",
    "K-12 Education",
    "Higher Education",
    "Early Childhood Education",
    "Special Education",
    "Adult Education",
    "Vocational Education",
    "Online Education",
    "Distance Learning",
    "E-Learning",
    "Instructional Design",
    "Curriculum Development",
    "Educational Technology",
    "Learning Management Systems",
    "Educational Assessment",
    "Standardized Testing",
    "Educational Psychology",
    "Learning Theories",
    "Pedagogy",
    "Andragogy",
    "Classroom Management",
    "Student Engagement",
    "Differentiated Instruction",
    "Inclusive Education",
    "Multicultural Education",
    "STEM Education",
    "Language Education",
    "Literacy",
    "Numeracy",
    "Educational Administration",
    "School Leadership",
    "Educational Policy",
    "Education Reform",
    "Academic Advising",
    "Career Counseling",
    "Student Affairs",
    "Educational Research",
    "Educational Statistics",

    // Technology & IT
    "Information Technology",
    "Software Development",
    "Web Development",
    "Mobile Development",
    "Full Stack Development",
    "Frontend Development",
    "Backend Development",
    "DevOps",
    "Cloud Computing",
    "AWS",
    "Azure",
    "Google Cloud Platform",
    "Virtualization",
    "Containerization",
    "Docker",
    "Kubernetes",
    "Microservices",
    "Serverless Architecture",
    "API Development",
    "RESTful APIs",
    "GraphQL",
    "Database Management",
    "SQL",
    "NoSQL",
    "Data Warehousing",
    "Big Data",
    "Data Engineering",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Natural Language Processing",
    "Computer Vision",
    "Deep Learning",
    "Cybersecurity",
    "Network Security",
    "Application Security",
    "Cloud Security",
    "Identity and Access Management",
    "Encryption",
    "Blockchain",
    "Distributed Systems",
    "Internet of Things",
    "Edge Computing",
    "Quantum Computing",
    "Augmented Reality",
    "Virtual Reality",
    "Mixed Reality",
    "Game Development",
    "IT Service Management",
    "ITIL",
    "IT Infrastructure",
    "Network Administration",
    "System Administration",
    "Technical Support",
    "IT Project Management",

    // Business & Management
    "Business Administration",
    "Strategic Management",
    "Operations Management",
    "Supply Chain Management",
    "Logistics",
    "Procurement",
    "Inventory Management",
    "Quality Management",
    "Six Sigma",
    "Lean Management",
    "Business Process Management",
    "Change Management",
    "Project Management",
    "Program Management",
    "Portfolio Management",
    "Agile Methodologies",
    "Scrum",
    "Kanban",
    "Waterfall Methodology",
    "Human Resources",
    "Talent Acquisition",
    "Talent Development",
    "Performance Management",
    "Compensation and Benefits",
    "Employee Relations",
    "Organizational Development",
    "Leadership Development",
    "Executive Coaching",
    "Management Consulting",
    "Business Analysis",
    "Business Intelligence",
    "Competitive Intelligence",
    "Market Intelligence",
    "Corporate Strategy",
    "Business Strategy",
    "Marketing Strategy",
    "Digital Strategy",
    "Innovation Management",
    "Entrepreneurship",
    "Startup Development",
    "Venture Capital",
    "Private Equity",
    "Mergers and Acquisitions",
    "Corporate Finance",
    "Business Valuation",
    "Business Law",
    "Corporate Governance",
    "Business Ethics",
    "Corporate Social Responsibility",
    "Sustainability",
  ],
};

const skillTypes = [
  "Technical Skills",
  "Soft Skills",
  "Management Skills",
  "Analytical Skills",
  "Creative Skills",
  "Domain Knowledge",
];

export default function SkillAssessment() {
  const [activeSkillType, setActiveSkillType] = useState<
    keyof typeof skillOptions
  >(skillTypes[0] as keyof typeof skillOptions);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillRatings, setSkillRatings] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState("select");

  const handleSkillSelect = (skill: string): void => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));

      // Remove rating when skill is deselected
      const newRatings = { ...skillRatings };
      delete newRatings[skill];
      setSkillRatings(newRatings);
    } else {
      setSelectedSkills([...selectedSkills, skill]);
      // Set default rating
      setSkillRatings({ ...skillRatings, [skill]: 3 });
    }
  };

  const handleRatingChange = (skill: string, value: number[]) => {
    setSkillRatings({ ...skillRatings, [skill]: value[0] });
  };

  const filteredSkills = skillOptions[
    activeSkillType as keyof typeof skillOptions
  ].filter((skill) =>
    skill.toLowerCase().includes(skillSearchQuery.toLowerCase()),
  );

  const handleSubmitAssessment = () => {
    // Format the data for submission
    const assessmentData = {
      skills: selectedSkills.map((skill) => ({
        name: skill,
        type: getSkillType(skill),
        score: skillRatings[skill] || 3,
      })),
    };

    // Store in localStorage for results page to access
    localStorage.setItem("assessmentData", JSON.stringify(assessmentData));

    // Navigate to results page (would use router in a real app)
    window.location.href = "/skill-assessment/results";
  };

  // Helper function to find skill type
  const getSkillType = (skillName: string): string => {
    for (const type of skillTypes) {
      if (skillOptions[type as keyof typeof skillOptions].includes(skillName)) {
        return type;
      }
    }
    return "Other";
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-col items-center">
        <h1 className="mb-2 text-center text-3xl font-bold">
          Skills Assessment
        </h1>
        <p className="max-w-2xl text-center text-muted-foreground">
          Identify your strengths and areas for improvement by selecting and
          rating your skills. Get personalized career recommendations based on
          your skill profile.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-0">
          <Tabs
            defaultValue="select"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 rounded-none">
              <TabsTrigger value="select">1. Select Skills</TabsTrigger>
              <TabsTrigger value="rate" disabled={selectedSkills.length === 0}>
                2. Rate Proficiency
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                disabled={selectedSkills.length === 0}
              >
                3. Review & Submit
              </TabsTrigger>
            </TabsList>

            {/* SELECT SKILLS TAB */}
            <TabsContent value="select" className="p-6">
              <div className="grid gap-6 md:grid-cols-[250px_1fr]">
                {/* Skill Type Selection */}
                <div>
                  <h3 className="mb-3 text-lg font-medium">Skill Categories</h3>
                  <div className="space-y-2">
                    {skillTypes.map((type) => (
                      <Button
                        key={type}
                        variant={
                          activeSkillType === type ? "default" : "outline"
                        }
                        className="w-full justify-start"
                        onClick={() =>
                          setActiveSkillType(type as keyof typeof skillOptions)
                        }
                      >
                        {type}
                      </Button>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-3 text-lg font-medium">
                      Selected Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.length > 0 ? (
                        selectedSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => handleSkillSelect(skill)}
                          >
                            {skill} ✕
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No skills selected yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skill Selection */}
                <div>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills..."
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="rounded-md border">
                    <div className="bg-muted p-3 font-medium">
                      {activeSkillType} ({filteredSkills.length})
                    </div>
                    <div className="max-h-[400px] overflow-y-auto p-2">
                      {filteredSkills.length > 0 ? (
                        <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                          {filteredSkills.map((skill) => (
                            <div
                              key={skill}
                              className="flex items-center rounded-md p-2 hover:bg-muted"
                            >
                              <input
                                type="checkbox"
                                id={`skill-${skill}`}
                                checked={selectedSkills.includes(skill)}
                                onChange={() => handleSkillSelect(skill)}
                                className="mr-2 h-4 w-4"
                              />
                              <label
                                htmlFor={`skill-${skill}`}
                                className="flex-1 cursor-pointer text-sm"
                              >
                                {skill}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="p-4 text-center text-muted-foreground">
                          No skills found matching your search
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={() => setActiveTab("rate")}
                      disabled={selectedSkills.length === 0}
                    >
                      Continue to Rate Proficiency{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* RATE PROFICIENCY TAB */}
            <TabsContent value="rate" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Rate Your Proficiency
                  </h2>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="mr-2">Beginner</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div
                          key={num}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-muted"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                    <span className="ml-2">Expert</span>
                  </div>
                </div>

                <div className="grid gap-6">
                  {selectedSkills.map((skill) => (
                    <Card key={skill} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                          <div>
                            <h3 className="font-medium">{skill}</h3>
                            <p className="text-sm text-muted-foreground">
                              {getSkillType(skill)}
                            </p>
                          </div>
                          <div className="max-w-md flex-1">
                            <Slider
                              value={[skillRatings[skill] || 3]}
                              min={1}
                              max={5}
                              step={1}
                              onValueChange={(value) =>
                                handleRatingChange(skill, value)
                              }
                              className="mt-2"
                            />
                            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                              <span>Beginner</span>
                              <span>Intermediate</span>
                              <span>Expert</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("select")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Select Skills
                  </Button>
                  <Button onClick={() => setActiveTab("preview")}>
                    Continue to Review <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* PREVIEW TAB */}
            <TabsContent value="preview" className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold">
                    Review Your Skills Assessment
                  </h2>
                  <p className="text-muted-foreground">
                    Review your selected skills and proficiency ratings before
                    submitting your assessment.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {Object.entries(
                    selectedSkills.reduce(
                      (acc, skill) => {
                        const type = getSkillType(skill);
                        if (!acc[type]) acc[type] = [];
                        acc[type].push({
                          name: skill,
                          rating: skillRatings[skill] || 3,
                        });
                        return acc;
                      },
                      {} as Record<string, { name: string; rating: number }[]>,
                    ),
                  ).map(([type, skills]) => (
                    <Card key={type}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{type}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {skills.map((skill) => (
                            <div
                              key={skill.name}
                              className="flex items-center justify-between"
                            >
                              <span>{skill.name}</span>
                              <Badge variant="outline">{skill.rating}/5</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("rate")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Rate
                    Proficiency
                  </Button>
                  <Button onClick={handleSubmitAssessment}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Submit Assessment
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
