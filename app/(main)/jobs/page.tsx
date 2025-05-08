"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Briefcase, Clock, DollarSign, MapPin, Search } from "lucide-react"
import JobList from "@/components/main/jobs/job-list";

export default function JobsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      <JobList />
    </div>
  );


  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    jobType: "",
    location: "",
    experience: "",
  })

  // Mock job data
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Solutions Ltd",
      location: "Kampala, Uganda",
      jobType: "Full-time",
      salary: "$800 - $1,200/month",
      postedDate: "2 days ago",
      description:
        "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces using modern technologies and implementing responsive designs.",
      skills: ["JavaScript", "React", "HTML/CSS", "Responsive Design"],
      match: 92,
    },
    {
      id: 2,
      title: "Backend Developer",
      company: "Innovate Uganda",
      location: "Kampala, Uganda",
      jobType: "Full-time",
      salary: "$900 - $1,400/month",
      postedDate: "1 week ago",
      description:
        "We're seeking a Backend Developer to design and implement server-side applications. The ideal candidate should have experience with Node.js and database management.",
      skills: ["Node.js", "Express", "MongoDB", "API Development"],
      match: 85,
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Creative Solutions",
      location: "Remote",
      jobType: "Contract",
      salary: "$15 - $25/hour",
      postedDate: "3 days ago",
      description:
        "Looking for a talented UI/UX Designer to create intuitive and engaging user experiences for our digital products. You should have a strong portfolio demonstrating your design skills.",
      skills: ["Figma", "User Research", "Wireframing", "Prototyping"],
      match: 78,
    },
    {
      id: 4,
      title: "Full Stack Developer",
      company: "Global Tech",
      location: "Entebbe, Uganda",
      jobType: "Full-time",
      salary: "$1,000 - $1,500/month",
      postedDate: "5 days ago",
      description:
        "We are looking for a Full Stack Developer who is proficient with both frontend and backend technologies. You will be responsible for developing and maintaining web applications.",
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
      match: 88,
    },
    {
      id: 5,
      title: "Mobile App Developer",
      company: "AppWorks",
      location: "Remote",
      jobType: "Part-time",
      salary: "$20 - $30/hour",
      postedDate: "1 day ago",
      description:
        "Seeking a Mobile App Developer to build and maintain mobile applications for iOS and Android platforms. Experience with React Native is required.",
      skills: ["React Native", "JavaScript", "Mobile UI Design", "API Integration"],
      match: 80,
    },
    {
      id: 6,
      title: "Data Analyst",
      company: "Data Insights",
      location: "Kampala, Uganda",
      jobType: "Full-time",
      salary: "$700 - $1,100/month",
      postedDate: "1 week ago",
      description:
        "We're looking for a Data Analyst to interpret data and turn it into information which can offer ways to improve a business, thus affecting business decisions.",
      skills: ["SQL", "Excel", "Data Visualization", "Statistical Analysis"],
      match: 75,
    },
  ]

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesJobType = !filters.jobType || job.jobType === filters.jobType
    const matchesLocation = !filters.location || job.location.includes(filters.location)

    return matchesSearch && matchesJobType && matchesLocation
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Job Listings</h1>
          <p className="text-muted-foreground">Find your next career opportunity</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search jobs, companies, or keywords"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Select value={filters.jobType} onValueChange={(value) => setFilters({ ...filters, jobType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Job Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Kampala">Kampala</SelectItem>
                <SelectItem value="Entebbe">Entebbe</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <Checkbox id="matchedJobs" />
          <Label htmlFor="matchedJobs" className="ml-2 text-sm">
            Show only jobs that match my skills
          </Label>
        </div>
      </div>

      {/* Job Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              jobType={job.jobType}
              salary={job.salary}
              postedDate={job.postedDate}
              description={job.description}
              skills={job.skills}
              match={job.match}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No jobs found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Add this interface before the JobCard component at the bottom of the file
interface JobCardProps {
  title: string
  company: string
  location: string
  jobType: string
  salary: string
  postedDate: string
  description: string
  skills: string[]
  match: number
}

// Then update the JobCard component in the render section
function JobCard({ title, company, location, jobType, salary, postedDate, description, skills, match }: JobCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{company}</CardDescription>
          </div>
          <div className="bg-primary/10 text-primary text-sm font-medium px-2 py-1 rounded-full h-fit">
            {match}% Match
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </div>
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-1" />
            {jobType}
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            {salary}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {postedDate}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
              {skill}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Save
        </Button>
        <Button size="sm" asChild>
          <Link href={`/job/${title.toLowerCase().replace(/\s+/g, "-")}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

