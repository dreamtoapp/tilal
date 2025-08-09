import { NextResponse } from 'next/server';
import { fetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

export async function GET() {
  try {
    const companyData = await fetchCompany();

    if (!companyData) {
      return NextResponse.json(
        { error: 'Platform settings not found' },
        { status: 404 }
      );
    }

    const platformSettings = {
      taxPercentage: companyData.taxPercentage || 15,
      shippingFee: companyData.shippingFee || 0,
      minShipping: companyData.minShipping || 0
    };

    return NextResponse.json(platformSettings);
  } catch (error) {
    console.error('Error fetching platform settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform settings' },
      { status: 500 }
    );
  }
} 