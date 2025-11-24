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

  return sendSuccess({
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
    },
  });
}

/**
 * Batch create businesses (for admin/seeding)
 */
async function batchCreateBusinesses(businessesData: any[]) {
  const operations = businessesData.map((businessData, index) => async () => {
    try {
      return await executeTransaction(async (tx) => {
        const business = await tx.business.create({
          data: businessData,
        });

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
      });
    } catch (error) {
      console.error(`Failed to create business at index ${index}:`, error);
      throw error;
    }
  });

  const { results, errors } = await batchOperationsWithProgress(
    operations,
    5, // Process 5 at a time
    (completed, total) => {
      console.log(`Batch progress: ${completed}/${total}`);
    }
  );

  return {
    created: results.length,
    errors: errors.length,
    errorDetails: errors,
  };
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

  // Use transaction for atomic business creation with analytics
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

  return sendSuccess(result, "Business created successfully", 201);
}

export const GETHandler = withErrorHandler(GET, "businesses-get");
export const POSTHandler = withErrorHandler(POST, "businesses-create");
export { GETHandler as GET, POSTHandler as POST };
