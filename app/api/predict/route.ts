import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export interface CareerFormData {
  age: string
  educationLevel: string
  careerPreference: string
  skills: string[]
  interests: string[]
}

export interface CareerResult {
  title: string
  matchScore: number
  description: string
  requiredSkills: string[]
  industryType: string
}

export async function POST(request: Request) {
  try {
    const formData: CareerFormData = await request.json()

    // Replace with your actual backend API endpoint
    const response = await fetch("http://localhost:8000/predict/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const results = await response.json()
    revalidatePath("/careers")
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error submitting career form:", error)
    // Return mock data as fallback in case of error
    const mockResults = [
      {
        title: "Software Developer",
        matchScore: 95,
        description: "Develop and maintain software applications and systems.",
        requiredSkills: ["JavaScript", "React", "Node.js", "Problem Solving"],
        industryType: "Technology",
      },
      {
        title: "Data Scientist",
        matchScore: 87,
        description: "Analyze and interpret complex data to help guide business decisions.",
        requiredSkills: ["Python", "Statistics", "Machine Learning", "Data Visualization"],
        industryType: "Technology/Research",
      },
      {
        title: "UX Designer",
        matchScore: 82,
        description: "Design user experiences for digital products and services.",
        requiredSkills: ["UI Design", "User Research", "Prototyping", "Wireframing"],
        industryType: "Design/Technology",
      },
    ]
    return NextResponse.json(mockResults)
  }
}
