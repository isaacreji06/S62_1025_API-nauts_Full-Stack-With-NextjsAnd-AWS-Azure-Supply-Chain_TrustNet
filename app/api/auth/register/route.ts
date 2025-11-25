import { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import { sendSuccess, sendError } from "@/lib/responseHandler"; // Import sendError too

const registerSchema = z.object({
  phone: z.string().min(10),
  name: z.string().min(2),
  businessName: z.string().optional(),
  role: z.enum(["CUSTOMER", "BUSINESS_OWNER"]).default("CUSTOMER"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, businessName, role } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return sendError(
        "User already exists with this phone number",
        "USER_EXISTS",
        400
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        phone,
        name,
        role,
      },
    });

    // If business owner, create business profile
    let business = null;
    if (role === "BUSINESS_OWNER" && businessName) {
      business = await prisma.business.create({
        data: {
          name: businessName,
          phone,
          ownerId: user.id,
          category: "OTHER",
        },
      });
    }

    return sendSuccess(
      {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
        },
        business,
      },
      "User registered successfully",
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(
        "Invalid input data",
        "VALIDATION_ERROR",
        400,
        error.issues
      );
    }

    console.error("Registration error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
