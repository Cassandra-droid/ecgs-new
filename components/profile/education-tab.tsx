"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { updateEducation } from "@/lib/profile"

interface Education {
  id?: string
  userId?: string
  institution: string
  degree: string
  field?: string | null
  startYear?: string | null
  endYear?: string | null
  description?: string | null
}

interface EducationTabProps {
  education: Education[]
  userId: string
}

export default function EducationTab({ education, userId }: EducationTabProps) {
  const [userEducation, setUserEducation] = useState<Education[]>(education)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newEducation, setNewEducation] = useState<Education>({
    id: "",
    userId,
    institution: "",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
    description: "",
  })

  const handleAddEducation = () => {
    setIsAddingNew(true)
    setNewEducation({
      id: Date.now().toString(), // temporary ID
      userId,
      institution: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
      description: "",
    })
  }

  const handleCancelAdd = () => {
    setIsAddingNew(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewEducation((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveNew = () => {
    if (!newEducation.institution || !newEducation.degree) {
      toast({
        title: "Missing information",
        description: "Please fill in the required fields.",
        variant: "destructive",
      })
      return
    }

    setUserEducation([...userEducation, { ...newEducation, userId }])
    setIsAddingNew(false)
  }

  const handleRemoveEducation = (id: string) => {
    setUserEducation(userEducation.filter((edu) => edu.id !== id))
  }
  const handleSaveEducation = async () => {
    setIsLoading(true)

    try {
      // We only need to send the fields that match our database schema
      const educationToSave = userEducation.map(({ institution, degree, startYear, endYear, field, description }) => ({
        institution,
        degree,
        field: field || "",
        start_year: startYear || "",
        end_year: endYear || "",
        description: description || "",
      }))

      // Call the updateEducation function with the education data
      await updateEducation(userId, educationToSave)

      toast({
        title: "Education updated",
        description: "Your education history has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update education. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Add your educational background and qualifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {userEducation.length > 0 && (
            <div className="space-y-4">
              {userEducation.map((edu) => (
                <div key={edu.id} className="rounded-md border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{edu.institution}</h3>
                      <p className="text-sm text-muted-foreground">
                        {edu.degree}
                        {edu.field ? `, ${edu.field}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {edu.startYear} - {edu.endYear || "Present"}
                      </p>
                      {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveEducation(edu.id!)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Remove education</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isAddingNew ? (
            <div className="rounded-md border p-4">
              <h3 className="mb-4 font-medium">Add New Education</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution*</Label>
                  <Input
                    id="institution"
                    name="institution"
                    value={newEducation.institution}
                    onChange={handleChange}
                    placeholder="e.g. Harvard University"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="degree">Degree/Level*</Label>
                  <Input
                    id="degree"
                    name="degree"
                    value={newEducation.degree}
                    onChange={handleChange}
                    placeholder="e.g. Bachelor's, Master's, PhD"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field">Field of Study</Label>
                  <Input
                    id="field"
                    name="field"
                    value={newEducation.field || ""}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="startYear">Start Year</Label>
                    <Input
                      id="startYear"
                      name="startYear"
                      value={newEducation.startYear || ""}
                      onChange={handleChange}
                      placeholder="e.g. 2018"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endYear">End Year</Label>
                    <Input
                      id="endYear"
                      name="endYear"
                      value={newEducation.endYear || ""}
                      onChange={handleChange}
                      placeholder="e.g. 2022 or Present"
                    />
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newEducation.description || ""}
                    onChange={handleChange}
                    placeholder="Additional details about your education"
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelAdd}>
                  Cancel
                </Button>
                <Button onClick={handleSaveNew}>Add Education</Button>
              </div>
            </div>
          ) : (
            <Button onClick={handleAddEducation}>
              <Plus className="mr-2 h-4 w-4" /> Add Education
            </Button>
          )}

          {!isAddingNew && userEducation.length > 0 && (
            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveEducation} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Education"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
