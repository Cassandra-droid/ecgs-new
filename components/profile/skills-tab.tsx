"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { updateUserSkills } from "@/lib/profile"

interface Skill {
  id: string
  name: string
  level: string
}

interface SkillsTabProps {
  skills: Skill[]
  userId: string
}

export default function SkillsTab({ skills, userId }: SkillsTabProps) {
  const [userSkills, setUserSkills] = useState<Skill[]>(skills)
  const [newSkill, setNewSkill] = useState({ name: "", level: "Intermediate" })
  const [isLoading, setIsLoading] = useState(false)

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return

    const skill = {
      id: Date.now().toString(),
      name: newSkill.name.trim(),
      level: newSkill.level,
    }

    setUserSkills([...userSkills, skill])
    setNewSkill({ name: "", level: "Intermediate" })
  }

  const handleRemoveSkill = (id: string) => {
    setUserSkills(userSkills.filter((skill) => skill.id !== id))
  }

  const handleSaveSkills = async () => {
    setIsLoading(true)

    try {
      await updateUserSkills(userId, userSkills)
      toast({
        title: "Skills updated",
        description: "Your skills have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update skills. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Intermediate":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Expert":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Add your professional skills and expertise</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="skill-name">Skill Name</Label>
              <Input
                id="skill-name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g. JavaScript, Project Management"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-level">Proficiency Level</Label>
              <select
                id="skill-level"
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={handleAddSkill} disabled={!newSkill.name.trim()}>
              <Plus className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </div>

          {userSkills.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Your Skills</h3>
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-1">
                    <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
                      <span>{skill.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill.id)}
                        className="ml-1 rounded-full p-0.5 hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {skill.name}</span>
                      </button>
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSkills} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Skills"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
              No skills added yet. Add your first skill above.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
