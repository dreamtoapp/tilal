import { NextResponse } from 'next/server';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '@/app/dashboard/management/about/actions/faq';

export async function GET() {
  const result = await getFAQs();
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = await createFAQ(body);
  return NextResponse.json(result);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  const result = await updateFAQ(id, data);
  return NextResponse.json(result);
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  const result = await deleteFAQ(id);
  return NextResponse.json(result);
} 