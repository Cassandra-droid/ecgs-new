"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { updateUserSkills } from "@/lib/profile"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, X } from "lucide-react"

// Predefined skills list
const PREDEFINED_SKILLS = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "HTML/CSS",
  "SQL",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Go",
  "Rust",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "Git",
  "Communication",
  "Leadership",
  "Problem Solving",
  "Critical Thinking",
  "Teamwork",
  "Project Management",
  "Agile/Scrum",
  "UI/UX Design",
  "Data Analysis",
  "Machine Learning",
]

interface SkillsSectionProps {
  skills: any[]
  onUpdate: () => void
}

export default function SkillsSection({ skills, onUpdate }: SkillsSectionProps) {
  const [loading, setLoading] = useState(false)
  const [userSkills, setUserSkills] = useState<any[]>(skills || [])
  const [newSkill, setNewSkill] = useState("")
  const [customSkill, setCustomSkill] = useState("")
  const { toast } = useToast()

  const handleAddSkill = () => {
    const skillName = newSkill || customSkill

    if (!skillName) {
      toast({
        title: "Missing skill name",
        description: "Please select or enter a skill name.",
        variant: "destructive",
      })
      return
    }

    // Check if skill already exists
    if (userSkills.some((skill) => skill.name.toLowerCase() === skillName.toLowerCase())) {
      toast({
        title: "Skill already added",
        description: "This skill is already in your profile.",
        variant: "destructive",
      })
      return
    }

    const newSkillObj = {
      id: Date.now().toString(),
      name: skillName,
    }

    setUserSkills([...userSkills, newSkillObj])
    setNewSkill("")
    setCustomSkill("")
  }

  const handleRemoveSkill = (skillId: string) => {
    setUserSkills(userSkills.filter((skill) => skill.id !== skillId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (userSkills.length === 0) {
      toast({
        title: "No skills added",
        description: "Please add at least one skill to continue.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await updateUserSkills(userSkills)
      toast({
        title: "Skills updated",
        description: "Your skills have been updated successfully.",
      })
      onUpdate()
    } catch (error) {
      console.error("Error updating skills:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your skills. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>
          Add skills to showcase your expertise. These will help match you with suitable career paths.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label>Skill Name</Label>
              <div className="flex gap-2">
                <div className="w-full relative">
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded-md"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Select or type a skill"
                  />
                  {newSkill && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-md z-10">
                      {PREDEFINED_SKILLS
                        .filter((skill) =>
                          skill.toLowerCase().includes(newSkill.toLowerCase())
                        )
                        .map((skill) => (
                          <div
                            key={skill}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setNewSkill(skill)
                              setCustomSkill("")
                            }}
                          >
                            {skill}
                          </div>
                        ))}
                      {newSkill && !PREDEFINED_SKILLS.includes(newSkill) && (
                        <div
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setCustomSkill(newSkill)}
                        >
                          Add custom skill: {newSkill}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {customSkill && <p className="text-xs text-muted-foreground">Custom skill: {customSkill}</p>}
            </div>
          </div>

          <Button type="button" variant="outline" onClick={handleAddSkill} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>

          <div className="mt-6">
            <h3 className="mb-2 font-medium">Your Skills</h3>
            {userSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills added yet. Add skills to continue.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill) => (
                  <Badge key={skill.id} variant="outline" className="flex items-center gap-2 px-3 py-1.5">
                    <span>{skill.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save & Continue"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
