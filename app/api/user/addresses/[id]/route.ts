import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/lib/prisma";
import { addressSchema } from '@/lib/zod/address';

// PUT: Update an existing address
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await req.json();

  // Validate address data
  const parse = addressSchema.safeParse(data);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten().fieldErrors }, { status: 400 });
  }

  const addressData = parse.data;

  try {
    // Check if address exists and belongs to user
    const existingAddress = await db.address.findFirst({
      where: { id, userId: session.user.id }
    });

    if (!existingAddress) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    // If setting as default, unset other defaults first
    if (addressData.isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await db.address.update({
      where: { id },
      data: addressData,
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Address update error:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Delete an address
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Prevent deletion of default address if it's the only one
    if (existingAddress.isDefault) {
      const addressCount = await db.address.count({
        where: { userId: session.user.id }
      });

      if (addressCount === 1) {
        return NextResponse.json({ 
          message: "Cannot delete the only address" 
        }, { status: 400 });
      }

      // If deleting default address but user has others, set another as default
      const nextAddress = await db.address.findFirst({
        where: { 
          userId: session.user.id,
          id: { not: id }
        },
        orderBy: { updatedAt: 'desc' }
      });

      if (nextAddress) {
        await db.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true }
        });
      }
    }

    await db.address.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error('Address deletion error:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 