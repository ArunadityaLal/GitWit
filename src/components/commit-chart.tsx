"use client"

import { useEffect, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format, subDays } from "date-fns"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "./ui/chart"

interface CommitChartProps {
  username: string
  loading: boolean
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

interface CommitData {
  date: string
  count: number
}

export function CommitChart({ username, loading, setLoading, setError }: CommitChartProps) {
  const [commitData, setCommitData] = useState<CommitData[]>([])

  useEffect(() => {
    const fetchCommitActivity = async () => {
      try {
        // GitHub API doesn't provide a simple endpoint for commit activity by user
        // This is a simplified approach that uses the events API
        const response = await fetch(`https://api.github.com/users/${username}/events?per_page=100`)
        if (!response.ok) {
          throw new Error(`Failed to fetch activity: ${response.statusText}`)
        }

        const events = await response.json()

        // Generate dates for the last 30 days
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = subDays(new Date(), i)
          return format(date, "yyyy-MM-dd")
        }).reverse()

        // Count push events per day
        const commitCounts = last30Days.map((date) => {
          const count = events
            .filter((event: any) => event.type === "PushEvent" && event.created_at.startsWith(date))
            .reduce((acc: number, event: any) => {
              // Each push event can contain multiple commits
              return acc + (event.payload.commits?.length || 0)
            }, 0)

          return { date, count }
        })

        setCommitData(commitCounts)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch commit activity")
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchCommitActivity()
    }
  }, [username, setLoading, setError])

  if (loading) {
    return <ChartSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Commit Activity
        </CardTitle>
        <CardDescription>Commit history for the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {commitData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={commitData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return format(date, "MMM d")
                  }}
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip
                  formatter={(value: number) => [`${value} commits`, "Commits"]}
                  labelFormatter={(value) => format(new Date(value), "MMMM d, yyyy")}
                />
                <Area type="monotone" dataKey="count" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorCommits)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center flex-col">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No commit data available</h3>
              <p className="text-muted-foreground">We couldn't find any recent commit activity for this user.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  )
}

