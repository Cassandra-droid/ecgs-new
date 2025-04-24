"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { useState } from "react"
import ProfileHeaderEdit from "./profile-header-edit"

interface ProfileHeaderProps {
  user: {
    name: string
    email: string
    image: string
    title: string
    bio: string
  }
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return <ProfileHeaderEdit user={user} onCancel={() => setIsEditing(false)} />
  }

  return (
    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
      <Avatar className="h-24 w-24">
        <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center space-x-2 sm:justify-start">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit profile header</span>
          </Button>
        </div>

        {user.title && <p className="text-lg text-muted-foreground">{user.title}</p>}

        <p className="text-sm text-muted-foreground">{user.email}</p>

        {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}
      </div>
    </div>
  )
}
