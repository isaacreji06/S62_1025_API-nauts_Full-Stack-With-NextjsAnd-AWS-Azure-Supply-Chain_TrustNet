import { QueryMonitor } from "@/lib/queryMonitor";
import { sendSuccess } from "@/lib/responseHandler";

async function GET() {
  const stats = QueryMonitor.getStats();

  // Analyze performance trends
  const analysis = {
    slowestQueries: stats.queries
      .filter((q: any) => q.duration > 100)
      .sort((a: any, b: any) => b.duration - a.duration)
      .slice(0, 5),
    mostFrequentQueries: stats.queries
      .reduce((acc: any, query: any) => {
        const key = query.operation;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
    averageResponseTime: stats.queries.reduce((sum: number, q: any) => sum + q.duration, 0) / stats.queries.length,
  };

  return sendSuccess({
    data: {
      summary: {
        totalQueries: stats.queries.length,
        uniqueOperations: new Set(stats.queries.map((q: any) => q.operation)).size,
        monitoringSince: stats.startTime,
      },
      analysis,
      recentQueries: stats.queries.slice(-10), // Last 10 queries
    },
    message: "Performance metrics retrieved successfully",
  });
}

export { GET };
