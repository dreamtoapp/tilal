// app/dashboard/seo/actions/updateSeoEntry.ts
"use server";
import { revalidatePath } from 'next/cache';

import {
  updateSeoEntry as globalUpdateSeoEntry,
} from '@/app/dashboard/management-seo/actions/seo';

export async function updateSeoEntry(id: string, data: Record<string, unknown>) {
  await globalUpdateSeoEntry(id, data);
  revalidatePath('/dashboard/seo');
}
