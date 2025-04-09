"use client"

import { useEffect, useState } from "react"
import { BookMarkedIcon, GitForkIcon, StarIcon } from "lucide-react"

import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

interface RepositoryListProps {
  username: string
  loading: boolean
  setLoading: (loading: boolean) => void 
  setError: (error: string | null) => void
}

interface Repository {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
}

export function RepositoryList({ username, loading, setLoading, setError }: RepositoryListProps) {
  const [repositories, setRepositories] = useState<Repository[]>([])

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
        if (!response.ok) {
          throw new Error(`Failed to fetch repositories: ${response.statusText}`)
        }
        const data = await response.json()
        setRepositories(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch repositories")
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchRepositories()
    }
  }, [username, setLoading, setError])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <RepositorySkeleton key={i} />
        ))}
      </div>
    )
  }

  if (repositories.length === 0) {
    return (
      <Card className="p-8 text-center">
        <BookMarkedIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium">No repositories found</h3>
        <p className="text-muted-foreground">This user doesn't have any public repositories yet.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {repositories.map((repo) => (
        <Card key={repo.id}>
          <CardHeader>
            <CardTitle className="text-xl">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {repo.name}
              </a>
            </CardTitle>
            {repo.description && <CardDescription>{repo.description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {repo.language && (
                <Badge variant="outline" className="text-xs">
                  {repo.language}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <StarIcon className="h-4 w-4" />
                <span>{repo.stargazers_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitForkIcon className="h-4 w-4" />
                <span>{repo.forks_count}</span>
              </div>
            </div>
            <div>
              Updated{" "}
              {new Date(repo.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function RepositorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-5 w-16" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-32" />
      </CardFooter>
    </Card>
  )
}

