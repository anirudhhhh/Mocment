// api/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/authOptions';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Optional: force Edge Runtime to be dynamic
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }

    const base64String = btoa(binary);
    const mime = file.type;
    const dataURI = `data:${mime};base64,${base64String}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'image',
      folder: 'review_uploads/images',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    return NextResponse.json({
      imageUrl: uploadResult.secure_url,
      success: true
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return NextResponse.json({
      error: 'Upload to Cloudinary failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
