"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateUserInterests } from "@/lib/profile"
import { useToast } from "@/components/ui/use-toast"
import { Plus, X, Search, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Predefined interests with categories
const INTEREST_CATEGORIES = {
  Professional: [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Cybersecurity",
    "Blockchain",
    "Game Development",
  ],
  Creative: [
    "UI/UX Design",
    "Graphic Design",
    "Photography",
    "Music",
    "Writing",
    "Drawing",
    "Painting",
    "Animation",
    "Video Editing",
    "3D Modeling",
  ],
  Business: [
    "Product Management",
    "Digital Marketing",
    "E-commerce",
    "Fintech",
    "Entrepreneurship",
    "Startups",
    "Business Analytics",
    "Project Management",
  ],
  Personal: [
    "Travel",
    "Sports",
    "Cooking",
    "Reading",
    "Fitness",
    "Gaming",
    "Hiking",
    "Yoga",
    "Meditation",
    "Languages",
  ],
  Academic: [
    "Research",
    "Teaching",
    "Mentoring",
    "Public Speaking",
    "Writing",
    "Philosophy",
    "Psychology",
    "History",
    "Science",
    "Mathematics",
  ],
}

// Flatten interests for search
const ALL_INTERESTS = Object.entries(INTEREST_CATEGORIES).flatMap(([category, interests]) =>
  interests.map((interest) => ({ name: interest, category })),
)

interface InterestsSectionProps {
  interests: any[]
  onUpdate: () => void
}

export default function InterestsSection({ interests, onUpdate }: InterestsSectionProps) {
  const [userInterests, setUserInterests] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [customInterest, setCustomInterest] = useState("")
  const [customCategory, setCustomCategory] = useState("Personal")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  // Initialize user interests from props
  useEffect(() => {
    if (interests && interests.length > 0) {
      // Map interests to the expected format with id, name, and category
      const formattedInterests = interests.map((interest) => ({
        id: interest.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
        name: interest.name,
        category: interest.category || "Personal",
      }))
      setUserInterests(formattedInterests)
    }
  }, [interests])

  // Filter interests based on search term
  const filteredInterests = ALL_INTERESTS.filter((interest) =>
    interest.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddInterest = (interestName: string, category = "Personal") => {
    if (!interestName.trim()) {
      toast({
        title: "Missing interest",
        description: "Please select or enter an interest",
        variant: "destructive",
      })
      return
    }

    // Check if interest already exists
    if (userInterests.some((interest) => interest.name.toLowerCase() === interestName.toLowerCase())) {
      toast({
        title: "Interest already added",
        description: "This interest is already in your profile",
        variant: "destructive",
      })
      return
    }

    const newInterest = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: interestName,
      category: category,
    }

    setUserInterests([...userInterests, newInterest])
    setSearchTerm("")
    setCustomInterest("")
    setShowSuggestions(false)
  }

  const handleAddCustomInterest = () => {
    if (customInterest.trim()) {
      handleAddInterest(customInterest, customCategory)
    }
  }

  const handleRemoveInterest = (interestId: string) => {
    setUserInterests(userInterests.filter((interest) => interest.id !== interestId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)

    if (userInterests.length === 0) {
      toast({
        title: "No interests added",
        description: "Please add at least one interest to continue.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      // Extract just the interest names for the API call
      const interestNames = userInterests.map((interest) => interest.name)
      await updateUserInterests(interestNames)

      setSuccess(true)
      toast({
        title: "Interests updated",
        description: "Your interests have been updated successfully.",
      })

      // Wait a moment to show the success state before proceeding
      setTimeout(() => {
        onUpdate()
      }, 1000)
    } catch (error) {
      console.error("Error updating interests:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your interests. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Close suggestions when clicking outside - but don't close when clicking inside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // @ts-ignore - we know these elements exist
      const suggestionsElement = document.querySelector(".interests-suggestions")
      const categoryElement = document.querySelector(".interests-categories")

      if (
        suggestionsElement &&
        !suggestionsElement.contains(event.target as Node) &&
        categoryElement &&
        !categoryElement.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Professional":
        return "bg-blue-100 text-blue-800"
      case "Creative":
        return "bg-rose-100 text-rose-800"
      case "Business":
        return "bg-green-100 text-green-800"
      case "Personal":
        return "bg-purple-100 text-purple-800"
      case "Academic":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Update the category selection to properly show suggestions
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category)
    setShowSuggestions(true)
    // Clear search term when selecting a category
    setSearchTerm("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interests</CardTitle>
        <CardDescription>
          Add your personal and professional interests to help us personalize your experience.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Search and add interests */}
          <div className="space-y-4">
            <Label>Search or add interests</Label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  className="pl-9"
                  placeholder="Search for an interest or type a custom one"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowSuggestions(true)
                    if (e.target.value) {
                      setCustomInterest(e.target.value)
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSuggestions(true)
                  }}
                />
              </div>

              {/* Interest suggestions */}
              {showSuggestions && (searchTerm || selectedCategory) && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg interests-suggestions">
                  {searchTerm && filteredInterests.length > 0 ? (
                    <div className="p-2">
                      <h4 className="mb-2 text-xs font-semibold text-muted-foreground">Search Results</h4>
                      <div className="space-y-1">
                        {filteredInterests.map((interest, index) => (
                          <div
                            key={`${interest.name}-${index}`}
                            className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-gray-100"
                            onClick={() => handleAddInterest(interest.name, interest.category)}
                          >
                            <span>{interest.name}</span>
                            <Badge variant="outline" className={cn("text-xs", getCategoryColor(interest.category))}>
                              {interest.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : searchTerm ? (
                    <div className="p-3">
                      <p className="text-sm text-muted-foreground">No matching interests found.</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <Select value={customCategory} onValueChange={setCustomCategory}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(INTEREST_CATEGORIES).map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start"
                          onClick={handleAddCustomInterest}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add &quot;{searchTerm}&quot; as a {customCategory} interest
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {selectedCategory && (
                    <div className="p-2">
                      <h4 className="mb-2 text-xs font-semibold text-muted-foreground">{selectedCategory} Interests</h4>
                      <div className="space-y-1">
                        {INTEREST_CATEGORIES[selectedCategory as keyof typeof INTEREST_CATEGORIES].map(
                          (interestName) => (
                            <div
                              key={interestName}
                              className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-gray-100"
                              onClick={() => handleAddInterest(interestName, selectedCategory)}
                            >
                              <span>{interestName}</span>
                              {userInterests.some((i) => i.name === interestName) && (
                                <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                                  Added
                                </Badge>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category filters */}
            <div className="space-y-2 interests-categories">
              <Label>Browse by category</Label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(INTEREST_CATEGORIES).map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={cn("cursor-pointer", selectedCategory === category ? "bg-primary" : "hover:bg-gray-100")}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCategorySelect(category)
                    }}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Your interests section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Your Interests ({userInterests.length})</h3>
              {userInterests.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-muted-foreground"
                  onClick={() => setUserInterests([])}
                >
                  Clear all
                </Button>
              )}
            </div>

            {userInterests.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">No interests added yet. Add interests to continue.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userInterests.map((interest) => (
                  <Badge key={interest.id} variant="secondary" className="flex items-center gap-2 px-3 py-1.5">
                    <span>{interest.name}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs", getCategoryColor(interest.category))}>
                      {interest.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest.id)}
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
            ) : success ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Saved Successfully
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
