"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Download, Users, BarChart3, TrendingUp, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

interface DashboardData {
  total_predictions: number
  average_confidence: number
  user_event_counts: { event_type: string; count: number }[]
}

interface EngagementData {
  daily_active_users: number
  weekly_active_users: number
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, engagementRes] = await Promise.all([
        axios.get("http://localhost:8000/api/dashboard_summary/"),
        axios.get("http://localhost:8000/api/user_engagement_summary/"),
      ])
      setDashboardData(dashboardRes.data)
      setEngagementData(engagementRes.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError("Failed to load dashboard data. Please try again later.")
      setLoading(false)
    }
  }

  const handleDownloadReport = () => {
    window.open("http://localhost:8000/api/export_prediction_report/", "_blank")
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={fetchDashboardData}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <Button onClick={handleDownloadReport} className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Predictions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-3xl font-bold">{dashboardData?.total_predictions ?? 0}</div>
              )}
            </CardContent>
          </Card>

          {/* Average Confidence */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-3xl font-bold">
                    {dashboardData?.average_confidence
                      ? (dashboardData.average_confidence * 100).toFixed(1) + "%"
                      : "N/A"}
                  </div>
                  {dashboardData?.average_confidence && (
                    <Progress value={dashboardData.average_confidence * 100} className="h-2 mt-2" />
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Daily Active Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-3xl font-bold">{engagementData?.daily_active_users ?? 0}</div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Active Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Weekly Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-3xl font-bold">{engagementData?.weekly_active_users ?? 0}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Events */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>User Event Counts</CardTitle>
            <CardDescription>Breakdown of user interactions by event type</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : dashboardData?.user_event_counts?.length ? (
              <div className="space-y-4">
                {dashboardData.user_event_counts.map((event, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{event.event_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{event.count}</span>
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(event.count / Math.max(...dashboardData.user_event_counts.map((e) => e.count))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No event data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

