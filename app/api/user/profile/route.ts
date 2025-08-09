import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        addresses: true,
        isOtp: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
} 