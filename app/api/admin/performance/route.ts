// app/api/admin/performance/route.ts
import { NextRequest } from "next/server";
import { QueryMonitor } from "@/lib/query-optimization";
import { withErrorHandler } from "@/lib/errorHandler";
import { sendSuccess } from "@/lib/responseHandler";

async function GET(request: NextRequest) {
  const stats = QueryMonitor.getStats();

  // Analyze performance trends
  const analysis = {
    totalQueries: stats.reduce((sum, stat) => sum + stat.count, 0),
    averageQueryTime:
      stats.reduce((sum, stat) => sum + stat.avgTime, 0) / stats.length,
    slowQueries: stats.filter((stat) => stat.avgTime > 1000),
    mostFrequent: stats.sort((a, b) => b.count - a.count).slice(0, 10),
    slowest: stats.sort((a, b) => b.avgTime - a.avgTime).slice(0, 10),
  };

  return sendSuccess({
    timestamp: new Date().toISOString(),
    stats,
    analysis,
    recommendations: generatePerformanceRecommendations(analysis),
  });
}

function generatePerformanceRecommendations(analysis: any): string[] {
  const recommendations: string[] = [];

  if (analysis.averageQueryTime > 500) {
    recommendations.push(
      "Consider adding database indexes for frequently queried fields"
    );
  }

  if (analysis.slowQueries.length > 5) {
    recommendations.push("Implement query caching for slow endpoints");
  }

  if (analysis.mostFrequent[0]?.count > 1000) {
    recommendations.push(
      "High frequency queries detected - consider implementing request deduplication"
    );
  }

  return recommendations;
}

export const GETHandler = withErrorHandler(GET, "performance-stats");
export { GETHandler as GET };
