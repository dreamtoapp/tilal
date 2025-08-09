import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/lib/prisma";
import { addressSchema } from '@/lib/zod/address';

// GET: List all addresses for the logged-in user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });
  return NextResponse.json(addresses);
}

// POST: Add a new address for the logged-in user
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  // Validate address data
  const parse = addressSchema.safeParse(data);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten().fieldErrors }, { status: 400 });
  }
  const addressData = parse.data;
  // Check if this is the user's first address
  const existingAddresses = await db.address.findMany({ where: { userId: session.user.id } });
  let isDefault = false;
  if (existingAddresses.length === 0) {
    isDefault = true;
  } else if (addressData.isDefault) {
    isDefault = true;
    // Unset default for all other addresses
    await db.address.updateMany({ where: { userId: session.user.id, isDefault: true }, data: { isDefault: false } });
  }
  const address = await db.address.create({
    data: {
      userId: session.user.id,
      ...addressData,
      isDefault,
    },
  });
  return NextResponse.json(address);
} 