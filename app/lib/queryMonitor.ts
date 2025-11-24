// Simple query performance monitoring
interface QueryStats {
  operation: string;
  duration: number;
  timestamp: Date;
  success: boolean;
}

class QueryMonitor {
  private static queries: QueryStats[] = [];
  private static startTime = new Date();

  static recordQuery(operation: string, duration: number, success: boolean = true) {
    this.queries.push({
      operation,
      duration,
      timestamp: new Date(),
      success
    });

    // Keep only last 1000 queries to prevent memory issues
    if (this.queries.length > 1000) {
      this.queries = this.queries.slice(-1000);
    }
  }

  static getStats() {
    return {
      queries: this.queries,
      startTime: this.startTime,
      totalQueries: this.queries.length,
      averageDuration: this.queries.reduce((sum, q) => sum + q.duration, 0) / this.queries.length || 0
    };
  }

  static clear() {
    this.queries = [];
    this.startTime = new Date();
  }
}

export { QueryMonitor };
