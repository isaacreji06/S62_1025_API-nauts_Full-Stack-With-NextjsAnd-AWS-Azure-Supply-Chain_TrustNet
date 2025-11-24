import { CacheService } from "@/lib/redis";
import { sendSuccess } from "@/lib/responseHandler";

async function GET() {
  const stats = await CacheService.getStats();

  return sendSuccess({
    data: stats,
    message: "Cache statistics retrieved successfully",
  });
}

export { GET };
