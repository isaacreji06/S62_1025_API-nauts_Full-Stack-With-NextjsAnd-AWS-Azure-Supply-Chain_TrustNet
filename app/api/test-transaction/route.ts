import { NextResponse } from "next/server";
import { executeTransaction, batchOperations } from "@/lib/transactions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test 1: Simple transaction
    const result = await executeTransaction(async (tx) => {
      const users = await tx.user.findMany({ take: 1 });
      return { users: users.length };
    });

    // Test 2: Batch operations
    const batchResults = await batchOperations([
      () => prisma.user.count(),
      () => prisma.business.count(),
    ]);

    return NextResponse.json({
      success: true,
      transactionTest: result,
      batchTest: batchResults,
      message: "Transaction utilities working correctly!",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: "Transaction test failed",
      },
      { status: 500 }
    );
  }
}
