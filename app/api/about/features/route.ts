import { NextResponse } from 'next/server';
import { getFeatures, createFeature, updateFeature, deleteFeature } from '@/app/dashboard/management/about/actions/features';

export async function GET() {
  const result = await getFeatures();
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = await createFeature(body);
  return NextResponse.json(result);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  const result = await updateFeature(id, data);
  return NextResponse.json(result);
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;
  const result = await deleteFeature(id);
  return NextResponse.json(result);
} 