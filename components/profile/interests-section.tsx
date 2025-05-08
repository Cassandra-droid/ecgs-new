import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

const PREDEFINED_INTERESTS = [
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
  "UI/UX Design",
  "Product Management",
  "Digital Marketing",
  "E-commerce",
  "Fintech",
  "Healthtech",
  "Edtech",
  "Sustainability",
  "Entrepreneurship",
  "Remote Work",
  "Startups",
  "Open Source",
  "Writing",
  "Public Speaking",
  "Teaching",
  "Mentoring",
  "Photography",
  "Music",
  "Travel",
  "Sports",
]

interface InterestsSectionProps {
  interests: any[]
  onUpdate: () => void
}

export default function InterestsSection({ interests, onUpdate }: InterestsSectionProps) {
  const [userInterests, setUserInterests] = useState<any[]>(interests || [])
  const [selectedInterest, setSelectedInterest] = useState("")
  const [customInterest, setCustomInterest] = useState("")

  const handleAddInterest = () => {
    const interestName = selectedInterest || customInterest.trim()

    if (!interestName) {
      alert("Please select or enter an interest")
      return
    }

    // Check if interest already exists
    if (userInterests.some((interest) => interest.name.toLowerCase() === interestName.toLowerCase())) {
      alert("This interest is already in your profile")
      return
    }

    const newInterest = { id: Date.now().toString(), name: interestName }
    setUserInterests([...userInterests, newInterest])
    setSelectedInterest("")
    setCustomInterest("")
  }

  const handleRemoveInterest = (interestId: string) => {
    setUserInterests(userInterests.filter((interest) => interest.id !== interestId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (userInterests.length === 0) {
      alert("Please add at least one interest")
      return
    }

    // Here you can handle saving the interests, for example, by calling your API.
    console.log("Interests to save:", userInterests)
    onUpdate()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Choose or enter an interest</Label>
          <select
            className="w-full border rounded-md p-2"
            value={selectedInterest}
            onChange={(e) => setSelectedInterest(e.target.value)}
          >
            <option value="">-- Select an interest --</option>
            {PREDEFINED_INTERESTS.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Or type a custom interest"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
            />
            <Button type="button" onClick={handleAddInterest}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-medium">Your Interests</h3>
          {userInterests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No interests added yet. Add interests to continue.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {userInterests.map((interest) => (
                <Badge key={interest.id} variant="outline" className="flex items-center gap-2 px-3 py-1.5">
                  <span>{interest.name}</span>
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

        <Button type="submit" className="w-full">
          Save & Continue
        </Button>
      </div>
    </form>
  )
}

