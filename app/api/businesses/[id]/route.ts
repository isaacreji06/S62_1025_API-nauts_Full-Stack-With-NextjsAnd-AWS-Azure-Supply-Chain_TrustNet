import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";

export async function GET(
  _request: NextRequest, // Add underscore to indicate unused parameter
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true, phone: true } },
        reviews: {
          include: {
            reviewer: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        endorsements: {
          include: {
            endorser: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        analytics: true,
      },
    });

    if (!business) {
      return sendError("Business not found", "BUSINESS_NOT_FOUND", 404);
    }

    return sendSuccess(business);
  } catch (error) {
    console.error("Get business error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function PUT(
  request: NextRequest, // This one is used, so keep as is
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json(); // request is used here

    const business = await prisma.business.update({
      where: { id },
      data: body,
      include: {
        owner: { select: { name: true, phone: true } },
      },
    });

    return sendSuccess(business);
  } catch (error) {
    console.error("Update business error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
