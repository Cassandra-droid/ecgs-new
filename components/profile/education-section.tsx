"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateEducation } from "@/lib/profile"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2 } from "lucide-react"

interface EducationSectionProps {
  education: any[]
  onUpdate: () => void
}

export default function EducationSection({ education, onUpdate }: EducationSectionProps) {
  const [loading, setLoading] = useState(false)
  const [educationEntries, setEducationEntries] = useState<any[]>(education || [])
  const { toast } = useToast()

  const handleAddEducation = () => {
    setEducationEntries([
      ...educationEntries,
      {
        id: Date.now().toString(),
        institution: "",
        degree: "",
        field: "",
        year: "",
        description: "",
      },
    ])
  }

  const handleRemoveEducation = (id: string) => {
    setEducationEntries(educationEntries.filter((entry) => entry.id !== id))
  }

  const handleEducationChange = (id: string, field: string, value: string) => {
    setEducationEntries(educationEntries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate education entries
    const invalidEntries = educationEntries.filter((entry) => !entry.institution || !entry.degree || !entry.year)

    if (invalidEntries.length > 0) {
      toast({
        title: "Incomplete education entries",
        description: "Please fill in all required fields (institution, degree, and year) for each education entry.",
        variant: "destructive",
      })
      return
    }

    if (educationEntries.length === 0) {
      toast({
        title: "No education entries",
        description: "Please add at least one education entry to continue.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await updateEducation("current", educationEntries)
      toast({
        title: "Education updated",
        description: "Your education information has been updated successfully.",
      })
      onUpdate()
    } catch (error) {
      console.error("Error updating education:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your education information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Add your educational background to help us recommend suitable career paths.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {educationEntries.map((entry, index) => (
            <div key={entry.id} className="rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Education #{index + 1}</h3>
                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveEducation(entry.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`institution-${entry.id}`}>Institution *</Label>
                  <Input
                    id={`institution-${entry.id}`}
                    value={entry.institution}
                    onChange={(e) => handleEducationChange(entry.id, "institution", e.target.value)}
                    placeholder="University/College/School name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`degree-${entry.id}`}>Degree/Certificate *</Label>
                  <Input
                    id={`degree-${entry.id}`}
                    value={entry.degree}
                    onChange={(e) => handleEducationChange(entry.id, "degree", e.target.value)}
                    placeholder="Bachelor's, Master's, Certificate, etc."
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`field-${entry.id}`}>Field of Study</Label>
                  <Input
                    id={`field-${entry.id}`}
                    value={entry.field}
                    onChange={(e) => handleEducationChange(entry.id, "field", e.target.value)}
                    placeholder="Computer Science, Business, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`year-${entry.id}`}>Year Range *</Label>
                  <Input
                    id={`year-${entry.id}`}
                    value={entry.year}
                    onChange={(e) => handleEducationChange(entry.id, "year", e.target.value)}
                    placeholder="2018 - 2022"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor={`description-${entry.id}`}>Description</Label>
                <Textarea
                  id={`description-${entry.id}`}
                  value={entry.description}
                  onChange={(e) => handleEducationChange(entry.id, "description", e.target.value)}
                  placeholder="Briefly describe your studies, achievements, etc."
                  rows={3}
                />
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={handleAddEducation} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Education
          </Button>
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
