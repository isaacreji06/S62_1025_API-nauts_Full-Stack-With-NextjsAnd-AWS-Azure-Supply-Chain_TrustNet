import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { sanitizeInput } from "@/utils/sanitize";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  reviewerId: z.string(),
});

// FIX: Update the Context interface to use Promise
interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
  try {
    // FIX: Await the params
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { businessId: id },
        include: {
          reviewer: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { businessId: id } }),
    ]);

    return sendSuccess({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function POST(request: NextRequest, context: Context) {
  try {
    // FIX: Await the params
    const { id } = await context.params;
    const body = await request.json();
    const { rating, comment, reviewerId } = reviewSchema.parse(body);

    // Verify business exists
    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      return sendError("Business not found", "BUSINESS_NOT_FOUND", 404);
    }

    // Sanitize comment if provided
    const sanitizedComment = comment ? sanitizeInput(comment) : undefined;

    const review = await prisma.review.create({
      data: {
        rating,
        comment: sanitizedComment,
        businessId: id,
        reviewerId,
        isVerified: true,
      },
      include: {
        reviewer: { select: { name: true } },
      },
    });

    // Update business analytics
    await updateBusinessAnalytics(id);

    return sendSuccess(review, "Review created successfully", 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(
        "Invalid review data",
        "VALIDATION_ERROR",
        400,
        error.issues
      );
    }

    console.error("Create review error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

async function updateBusinessAnalytics(businessId: string) {
  const reviews = await prisma.review.findMany({
    where: { businessId },
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  await prisma.businessAnalytics.upsert({
    where: { businessId },
    update: {
      totalReviews: reviews.length,
      averageRating,
      lastUpdated: new Date(),
    },
    create: {
      businessId,
      totalReviews: reviews.length,
      averageRating,
      lastUpdated: new Date(),
    },
  });
}
