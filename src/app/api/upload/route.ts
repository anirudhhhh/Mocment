import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import cloudinary from '@/lib/cloudinary';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get data
  const formData = await request.formData();
  const file = formData.get('media') as File;
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No video uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Convert buffer to base64 and create data URI
  const base64String = buffer.toString('base64');
  const mime = file.type;
  const dataUri = `data:${mime};base64,${base64String}`;
  let mediaUrl: string | null = null;
 try {
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'reviews',
        resource_type: 'auto',
      });
      mediaUrl = result.secure_url;
    } catch (error) {
      return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
    }
}



