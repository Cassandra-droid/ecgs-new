import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUpIcon as TrendUp, Briefcase, Users } from "lucide-react"

export default function TrendingCareers() {
  const trendingCareers = [
    {
      title: "Data Scientist",
      growth: "26% growth",
      salary: "$100,000 - $150,000",
      description: "Analyze complex data sets to help guide business decisions.",
      skills: ["Python", "Machine Learning", "Statistics", "SQL"],
      industry: "Technology/Research",
    },
    {
      title: "Cybersecurity Analyst",
      growth: "33% growth",
      salary: "$90,000 - $140,000",
      description: "Protect systems and networks from cyber threats and attacks.",
      skills: ["Network Security", "Risk Analysis", "Security Tools", "Programming"],
      industry: "Technology/Security",
    },
    {
      title: "Healthcare Administrator",
      growth: "20% growth",
      salary: "$70,000 - $120,000",
      description: "Manage healthcare facilities, services, and staff.",
      skills: ["Healthcare Management", "Leadership", "Compliance", "Finance"],
      industry: "Healthcare",
    },
    {
      title: "Renewable Energy Engineer",
      growth: "17% growth",
      salary: "$80,000 - $130,000",
      description: "Design and develop renewable energy systems and solutions.",
      skills: ["Engineering", "Renewable Technologies", "Project Management", "Design"],
      industry: "Energy/Engineering",
    },
    {
      title: "UX/UI Designer",
      growth: "22% growth",
      salary: "$75,000 - $120,000",
      description: "Create user-friendly interfaces and experiences for digital products.",
      skills: ["UI Design", "User Research", "Prototyping", "Wireframing"],
      industry: "Technology/Design",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendUp className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Trending Careers in 2025</h2>
      </div>
      <p className="text-muted-foreground">
        Explore the fastest-growing career paths based on industry demand and salary potential.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trendingCareers.map((career, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{career.title}</CardTitle>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {career.growth}
                </Badge>
              </div>
              <CardDescription>{career.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{career.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{career.industry}</span>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Key Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {career.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
