"use client"

import { useEffect, useState } from "react"
import { CalendarDaysIcon, MapPinIcon, UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

interface ProfileCardProps {
  username: string
  loading: boolean
  setLoading: (loading: boolean) => void 
  setError: (error: string | null) => void
}

interface UserProfile {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  location: string | null
  followers: number
  following: number
  public_repos: number
  created_at: string
  company: string | null
}

export function ProfileCard({ username, loading, setLoading, setError }: ProfileCardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`)
        if (!response.ok) {
          throw new Error(`User not found: ${response.statusText}`)
        }
        const data = await response.json()
        setProfile(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch user profile")
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchProfile()
    }
  }, [username, setLoading, setError])

  if (loading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return null
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Avatar className="h-24 w-24 border-2 border-muted">
          <AvatarImage src={profile.avatar_url} alt={profile.login} />
          <AvatarFallback>{profile.login.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1.5">
          <CardTitle className="text-2xl">{profile.name || profile.login}</CardTitle>
          <CardDescription className="text-base">
            <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              @{profile.login}
            </a>
          </CardDescription>
          {profile.bio && <p className="text-sm text-muted-foreground">{profile.bio}</p>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {profile.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.company && (
              <div className="flex items-center gap-2 text-sm">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span>{profile.company}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
              <span>Joined on {joinDate}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <Card className="p-4">
              <h3 className="text-2xl font-bold">{profile.public_repos}</h3>
              <p className="text-xs text-muted-foreground">Repositories</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-2xl font-bold">{profile.followers}</h3>
              <p className="text-xs text-muted-foreground">Followers</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-2xl font-bold">{profile.following}</h3>
              <p className="text-xs text-muted-foreground">Following</p>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full md:w-96" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

