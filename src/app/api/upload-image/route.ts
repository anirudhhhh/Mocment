// api/upload-image/route.ts 
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get data - Changed from 'media' to 'image' to match React component
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert buffer to base64 and create data URI
    const base64String = buffer.toString('base64');
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