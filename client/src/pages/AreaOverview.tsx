import { Navbar } from "@/components/layout/Navbar";
import { useIssues } from "@/hooks/use-issues";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Activity, AlertTriangle, CheckCircle } from "lucide-react";

export default function AreaOverview() {
  const { data: issues, isLoading } = useIssues();

  // Simple stats calculation
  const totalIssues = issues?.length || 0;
  const resolvedIssues = issues?.filter(i => i.status === "Resolved").length || 0;
  const inProgressIssues = issues?.filter(i => i.status === "In Progress" || i.status === "Forwarded").length || 0;
  const reportedIssues = issues?.filter(i => i.status === "Reported").length || 0;

  // Group by category for a simple heatmap/grid
  const categoryCounts = issues?.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-muted/30 pb-24 md:pb-12 pt-4 md:pt-20">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8 mt-12 md:mt-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Area Overview</h1>
            <p className="text-muted-foreground mt-2">Civic health dashboard for your neighborhood.</p>
          </div>
          <div className="text-sm font-medium bg-white px-3 py-1.5 rounded-lg border shadow-sm">
            Area Code: <span className="text-primary">Indiranagar (560038)</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Total Issues" 
            value={totalIssues} 
            icon={Activity} 
            color="text-primary" 
            bg="bg-primary/10" 
          />
          <StatsCard 
            title="Resolved" 
            value={resolvedIssues} 
            icon={CheckCircle} 
            color="text-green-600" 
            bg="bg-green-100" 
          />
          <StatsCard 
            title="In Progress" 
            value={inProgressIssues} 
            icon={BarChart} 
            color="text-blue-600" 
            bg="bg-blue-100" 
          />
          <StatsCard 
            title="Needs Attention" 
            value={reportedIssues} 
            icon={AlertTriangle} 
            color="text-orange-600" 
            bg="bg-orange-100" 
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              Recent Activity
            </h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {issues?.slice(0, 10).map((issue) => (
                    <div key={issue.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm truncate">{issue.category}</span>
                          <span className="text-xs text-muted-foreground">• {issue.location}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{issue.description}</p>
                      </div>
                      <StatusBadge status={issue.status} className="shrink-0" />
                    </div>
                  ))}
                  {issues?.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      No recent activity in this area.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Heatmap */}
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold">Problem Hotspots</h2>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Issues by Category</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {isLoading ? (
                  <Skeleton className="h-40 w-full" />
                ) : (
                  Object.entries(categoryCounts || {}).map(([category, count]) => {
                    const percentage = Math.round((count / totalIssues) * 100);
                    return (
                      <div key={category} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category}</span>
                          <span className="text-muted-foreground">{count} issues ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
                {!isLoading && Object.keys(categoryCounts || {}).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No data available.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none">
              <CardContent className="p-6">
                <h3 className="font-display font-bold text-lg mb-2">Did you know?</h3>
                <p className="text-sm text-primary-foreground/90 leading-relaxed">
                  Reporting potholes within 24 hours of spotting them increases the fix rate by 40%. Keep contributing to a better neighborhood!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color, bg }: { title: string, value: number, icon: any, color: string, bg: string }) {
  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase">{title}</p>
          <p className="text-2xl font-display font-bold mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
}
