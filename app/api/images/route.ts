import {
  NextRequest,
  NextResponse,
} from 'next/server';

import prisma from '@/lib/prisma';
import { uploadImageToCloudinary } from '@/lib/sendTOCloudinary';

// Allowed models for image updates
const SUPPORTED_TABLES = {
  user: 'user',
  product: 'product',
  supplier: 'supplier',
  category: 'category',
  order: 'order',
  company: 'company',
  offer: 'offer',
  aboutPageContent: 'aboutPageContent',
  feature: 'feature',
} as const;

type TableName = keyof typeof SUPPORTED_TABLES;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get('file') as File | null;
    const recordId = formData.get('recordId') as string | null;
    const table = formData.get('table') as TableName | null;
    const tableField = formData.get('tableField') as string | null;
    const cloudinaryPreset = formData.get('cloudinaryPreset') as string | null;
    const folder = formData.get('folder') as string | null;
    const uploadOnly = formData.get('uploadOnly') as string | null;

    // Use environment variables for Cloudinary configuration
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'E-comm';
    const clientFolder = process.env.CLOUDINARY_CLIENT_FOLDER || 'E-comm';
    
    // Build folder structure: uploadPreset/clientFolder/tableName or use provided folder
    const finalFolder = folder || `${uploadPreset}/${clientFolder}/${table}`;



    // Validate required fields based on mode
    if (!file || !table) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          details: {
            file: file?.name ?? null,
            table,
            uploadOnly: uploadOnly || 'false',
            cloudinaryPreset: cloudinaryPreset || uploadPreset,
            folder: finalFolder,
          },
        },
        { status: 400 }
      );
    }

    // For non-upload-only mode, require recordId and tableField
    if (!uploadOnly && (!recordId || !tableField)) {
      return NextResponse.json(
        {
          error: 'Missing required fields for database update',
          details: {
            recordId,
            tableField,
            uploadOnly: uploadOnly || 'false',
          },
        },
        { status: 400 }
      );
    }

    // Only validate model if we need to update the database
    let model;
    if (!uploadOnly) {
      const modelKey = SUPPORTED_TABLES[table];
      model = (prisma as any)[modelKey];

      if (!model?.update) {
        return NextResponse.json(
          { error: `Invalid model or model not supported for updates: ${table}` },
          { status: 400 }
        );
      }
    }

    // Convert file to Base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary using environment variables
    let imageUrl;
    try {
      const finalPreset = cloudinaryPreset || uploadPreset;
      imageUrl = await uploadImageToCloudinary(dataUri, finalPreset, finalFolder);
      console.log('[CLOUDINARY UPLOAD SUCCESS]', {
        imageUrl,
        preset: finalPreset,
        folder: finalFolder,
        table
      });
    } catch (cloudinaryError) {
      console.error('[CLOUDINARY UPLOAD ERROR]', cloudinaryError);
      return NextResponse.json({ 
        error: 'Failed to upload image to Cloudinary',
        details: cloudinaryError instanceof Error ? cloudinaryError.message : 'Unknown Cloudinary error'
      }, { status: 500 });
    }

    // Update database only if not in upload-only mode
    if (!uploadOnly) {
      // Dynamically build data object
      const updateData = {
        [tableField!]: imageUrl,
      };

      let result;
      try {
        result = await model.update({
          where: { id: recordId },
          data: updateData,
        });
      } catch (dbError) {
        console.error('[DB UPDATE ERROR]', dbError);
        return NextResponse.json({ error: 'Failed to update record in DB' }, { status: 500 });
      }

      console.log(`[${table.toUpperCase()} UPDATED]`, result);
    } else {
      console.log(`[UPLOAD ONLY MODE] Image uploaded to Cloudinary: ${imageUrl}`);
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('[UNHANDLED ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
