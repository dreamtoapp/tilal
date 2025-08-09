import { NextRequest, NextResponse } from "next/server";
import { createDraftOrder } from "@/app/(e-comm)/(cart-flow)/checkout/actions/orderActions";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Convert JSON to FormData for createDraftOrder
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    // createDraftOrder now returns orderId
    const orderId = await createDraftOrder(formData);
    return NextResponse.json({ orderId });
  } catch (error: any) {
    // Enhanced error handling for validation errors
    if (error && error.validationErrors) {
      return NextResponse.json({ validationErrors: error.validationErrors }, { status: 400 });
    }
    if (error && error.code === 'REDIRECT_TO_HAPPYORDER') {
      return NextResponse.json({ redirect: '/happyorder' }, { status: 409 });
    }
    return NextResponse.json({ message: error.message || "حدث خطأ أثناء إنشاء الطلب" }, { status: 400 });
  }
}

export function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
} 