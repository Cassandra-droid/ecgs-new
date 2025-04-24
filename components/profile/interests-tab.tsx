"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { updateUserInterests } from "@/lib/profile"

interface Interest {
  id: string
  name: string
  category: string
}

interface InterestsTabProps {
  interests: Interest[]
  userId: string
}

export default function InterestsTab({ interests, userId }: InterestsTabProps) {
  const [userInterests, setUserInterests] = useState<Interest[]>(interests)
  const [newInterest, setNewInterest] = useState({ name: "", category: "Personal" })
  const [isLoading, setIsLoading] = useState(false)

  const handleAddInterest = () => {
    if (!newInterest.name.trim()) return

    const interest = {
      id: Date.now().toString(),
      name: newInterest.name.trim(),
      category: newInterest.category,
    }

    setUserInterests([...userInterests, interest])
    setNewInterest({ name: "", category: "Personal" })
  }

  const handleRemoveInterest = (id: string) => {
    setUserInterests(userInterests.filter((interest) => interest.id !== id))
  }

  const handleSaveInterests = async () => {
    setIsLoading(true)

    try {
      await updateUserInterests(userId, userInterests)
      toast({
        title: "Interests updated",
        description: "Your interests have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update interests. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const categories = ["Personal", "Professional", "Hobby", "Academic", "Other"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interests</CardTitle>
        <CardDescription>Add your personal and professional interests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="interest-name">Interest</Label>
              <Input
                id="interest-name"
                value={newInterest.name}
                onChange={(e) => setNewInterest({ ...newInterest, name: e.target.value })}
                placeholder="e.g. Photography, Machine Learning"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest-category">Category</Label>
              <select
                id="interest-category"
                value={newInterest.category}
                onChange={(e) => setNewInterest({ ...newInterest, category: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={handleAddInterest} disabled={!newInterest.name.trim()}>
              <Plus className="mr-2 h-4 w-4" /> Add Interest
            </Button>
          </div>

          {userInterests.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Your Interests</h3>

              {categories.map((category) => {
                const categoryInterests = userInterests.filter((interest) => interest.category === category)

                if (categoryInterests.length === 0) return null

                return (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {categoryInterests.map((interest) => (
                        <Badge key={interest.id} variant="outline" className="flex items-center gap-1 px-3 py-1">
                          <span>{interest.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInterest(interest.id)}
                            className="ml-1 rounded-full p-0.5 hover:bg-muted"
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {interest.name}</span>
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              })}

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveInterests} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Interests"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
              No interests added yet. Add your first interest above.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
