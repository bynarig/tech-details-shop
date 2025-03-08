import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth/serverAuthUtils';

// This is a more secure approach - storing the client ID on server-side
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const IMGUR_UPLOAD_URL = 'https://api.imgur.com/3/image';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getUserFromToken();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    const formData = await request.formData();
    const imageFile = formData.get('image');
    
    if (!imageFile || !(imageFile instanceof Blob)) {
      return NextResponse.json(
        { error: 'No image provided or invalid image' },
        { status: 400 }
      );
    }

    // Forward the request to Imgur
    const imgurResponse = await fetch(IMGUR_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
      },
      body: formData,
    });
    
    const data = await imgurResponse.json();
    
    if (!imgurResponse.ok) {
      console.error('Imgur upload failed:', data);
      return NextResponse.json(
        { error: data.data?.error || 'Image upload failed' },
        { status: imgurResponse.status }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: data.data.id,
        link: data.data.link,
        deletehash: data.data.deletehash,
      }
    });
    
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}