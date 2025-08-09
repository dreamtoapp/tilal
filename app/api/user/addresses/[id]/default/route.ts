import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/lib/prisma";

// POST: Set an address as default
export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Check if address exists and belongs to user
    const existingAddress = await db.address.findFirst({
      where: { id, userId: session.user.id }
    });

    if (!existingAddress) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    // Unset all other default addresses for this user
    await db.address.updateMany({
      where: { userId: session.user.id, isDefault: true },
      data: { isDefault: false }
    });

    // Set this address as default
    const updatedAddress = await db.address.update({
      where: { id },
      data: { isDefault: true }
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Set default address error:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 