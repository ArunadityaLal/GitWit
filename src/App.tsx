"use client"

import type React from "react" 

import { useState } from "react"
import { GithubIcon, SearchIcon } from "lucide-react"

import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Skeleton } from "./components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"

import { ProfileCard } from "./components/profile-card"
import { RepositoryList } from "./components/repository-list"
import { CommitChart } from "./components/commit-chart"

export default function App() {
  const [username, setUsername] = useState("")
  const [searchedUser, setSearchedUser] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setLoading(true)
    setError(null)
    setSearchedUser(username)
  }

  return (
    <div className="min-h-svh bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GithubIcon className="h-8 w-8" />
            <h1 className="text-2xl font-bold">GitHub Profile Analyzer</h1>
          </div>
          <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
            <Input
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="md:w-80"
            />
            <Button type="submit" disabled={loading || !username.trim()}>
              {loading ? (
                <span className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4 rounded-full animate-spin" />
                  Loading
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <SearchIcon className="h-4 w-4" />
                  Search
                </span>
              )}
            </Button>
          </form>
        </header>

        {error && <Card className="p-6 text-center text-red-500 bg-red-50 dark:bg-red-950/20">{error}</Card>}

        {searchedUser && !error && (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="repositories">Repositories</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-4">
              <ProfileCard username={searchedUser} loading={loading} setLoading={setLoading} setError={setError} />
            </TabsContent>
            <TabsContent value="repositories" className="mt-4">
              <RepositoryList username={searchedUser} loading={loading} setLoading={setLoading} setError={setError} />
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <CommitChart username={searchedUser} loading={loading} setLoading={setLoading} setError={setError} />
            </TabsContent>
          </Tabs>
        )}

        {!searchedUser && !error && (
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <GithubIcon className="h-16 w-16 mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Enter a GitHub Username</h2>
            <p className="text-muted-foreground max-w-md">
              Search for a GitHub user to see their profile information, repositories, and commit activity.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

