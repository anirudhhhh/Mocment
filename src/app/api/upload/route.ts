import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import cloudinary from '../../../lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const mediaField = formData.get('media');

    if (!mediaField) {
      return NextResponse.json(
        { error: 'Media field is required' }, 
        { status: 400 }
      );
    }

    if (!(mediaField instanceof File)) {
      return NextResponse.json(
        { error: 'Media field must be a file' }, 
        { status: 400 }
      );
    }

    const file = mediaField;
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64String = btoa(binary);

    const mime = file.type;
    const dataUri = `data:${mime};base64,${base64String}`;

    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'reviews',
        resource_type: 'auto',
      });

      return NextResponse.json(
        {
          success: true,
          mediaUrl: result.secure_url,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
    }

  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



