// app/api/businesses/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendSuccess } from "@/lib/responseHandler";
import {
  ValidationError,
  DatabaseError,
  ConflictError,
} from "@/lib/customErrors";
import { withErrorHandler } from "@/lib/errorHandler";
import {
  executeTransaction,
  batchOperationsWithProgress,
} from "@/lib/transactions";
import {
  QueryOptimizer,
  QueryMonitor,
  AdvancedQueryOptimizer,
  QueryResultTransformer,
} from "@/lib/query-optimization";
import { CacheStrategies, CACHE_CONFIG } from "@/lib/cache-strategies";

const businessSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.enum([
    "FOOD_RESTAURANT",
    "RETAIL_SHOP",
    "SERVICES",
    "HOME_BUSINESS",
    "STREET_VENDOR",
    "ARTISAN",
    "OTHER",
  ]),
  address: z.string().max(200).optional(),
  phone: z.string().min(10).max(15),
  location: z.string().max(100).optional(),
  ownerId: z.string().min(1),
});

async function GET(request: NextRequest) {
  const trackQuery = QueryMonitor.startTracking("businesses_list");

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Math.min(Number(searchParams.get("limit")) || 10, 100);
  const category = searchParams.get("category");
  const verified = searchParams.get("verified");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy") || "trustScore";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const viewType =
    (searchParams.get("view") as "list" | "detail" | "card") || "list";

  // Check cache first
  const cacheParams = {
    page,
    limit,
    category,
    verified,
    search,
    sortBy,
    sortOrder,
    viewType,
  };
  const cacheResult = await CacheStrategies.getBusinessList(cacheParams);

  if (cacheResult.source === "cache") {
    const duration = trackQuery();
    return sendSuccess({
      ...cacheResult.data,
      performance: {
        ...cacheResult.data.performance,
        queryTime: duration,
        cached: true,
        source: "redis",
      },
    });
  }

  // Build base where clause
  const baseWhere = QueryOptimizer.buildWhereClause({
    ...(category && { category }),
    ...(verified && { isVerified: verified === "true" }),
  });

  // Build search conditions separately
  const searchWhere = search
    ? QueryOptimizer.buildSearchConditions(search, ["name", "description"])
    : undefined;

  // Combine base where and search where
  const where = searchWhere ? { ...baseWhere, ...searchWhere } : baseWhere;

  const pagination = QueryOptimizer.buildPagination(page, limit);
  const orderBy = QueryOptimizer.buildOrderBy(sortBy, sortOrder);
  const select = QueryOptimizer.buildOptimizedSelect(viewType);
  const include = AdvancedQueryOptimizer.buildEagerLoadingIncludes("business");

  // Analyze query complexity
  const queryAnalysis = AdvancedQueryOptimizer.analyzeQueryComplexity({
    where,
    include,
    ...pagination,
    orderBy,
  });

  // Execute optimized query
  const [businesses, total] = await Promise.all([
    prisma.business.findMany({
      where,
      select, // Use select instead of include for list views
      ...(viewType === "detail" && { include }), // Only use include for detail views
      ...pagination,
      orderBy,
    }),
    prisma.business.count({ where }),
  ]);

  const duration = trackQuery();

  // Transform results for optimal payload
  const transformedBusinesses =
    viewType === "list"
      ? QueryResultTransformer.transformBusinesses(businesses)
      : businesses;

  const responseData = {
    businesses: transformedBusinesses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    performance: {
      queryTime: duration,
      optimized: true,
      complexity: queryAnalysis.complexity,
      warnings: queryAnalysis.warnings,
      cached: false,
      source: "database",
    },
  };

  // Cache the result
  await CacheStrategies.setBusinessList(cacheParams, responseData);

  return sendSuccess(responseData);
}

async function POST(request: NextRequest) {
  const body = await request.json();

  // Check if it's a batch operation
  if (Array.isArray(body)) {
    if (body.length > 100) {
      return sendSuccess(
        { error: "Batch too large. Maximum 100 items." },
        "Batch creation failed",
        400
      );
    }

    const result = await batchCreateBusinesses(body);

    // Invalidate cache after batch creation
    await CacheStrategies.invalidateAll();

    return sendSuccess(result, `Batch created ${result.created} businesses`);
  }

  // Single business creation
  const businessData = businessSchema.parse(body);

  // Check if business with same name/phone already exists
  const existingBusiness = await prisma.business.findFirst({
    where: {
      OR: [{ name: businessData.name }, { phone: businessData.phone }],
    },
  });

  if (existingBusiness) {
    throw new ConflictError("Business with this name or phone already exists");
  }

  const result = await executeTransaction(
    async (tx) => {
      // Create business
      const business = await tx.business.create({
        data: businessData,
        include: {
          owner: { select: { name: true, phone: true } },
        },
      });

      // Initialize analytics in same transaction (atomic operation)
      await tx.businessAnalytics.create({
        data: {
          businessId: business.id,
          totalReviews: 0,
          averageRating: 0,
          totalEndorsements: 0,
          monthlyVisits: 0,
          upiTransactionVolume: 0,
          customerRetentionRate: 0,
        },
      });

      return business;
    },
    {
      maxRetries: 3,
      timeout: 10000,
    }
  );

  // Invalidate cache after creation
  await CacheStrategies.invalidateBusiness(result.id);

  return sendSuccess(result, "Business created successfully", 201);
}

// Add PUT and DELETE handlers with cache invalidation
async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const body = await request.json();

  const result = await executeTransaction(async (tx) => {
    return await tx.business.update({
      where: { id },
      data: body,
      include: {
        owner: { select: { name: true, phone: true } },
      },
    });
  });

  // Invalidate cache after update
  await CacheStrategies.invalidateBusiness(id);

  return sendSuccess(result, "Business updated successfully");
}

async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  await executeTransaction(async (tx) => {
    await tx.business.delete({
      where: { id },
    });
  });

  // Invalidate cache after deletion
  await CacheStrategies.invalidateBusiness(id);

  return sendSuccess(null, "Business deleted successfully");
}

export const GETHandler = withErrorHandler(GET, "businesses-get");
export const POSTHandler = withErrorHandler(POST, "businesses-create");
export { GETHandler as GET, POSTHandler as POST };
