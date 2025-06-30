import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, text, image, link } = body;

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const blogRef = doc(db, 'blogs', id);
    const blogSnap = await getDoc(blogRef);

    if (!blogSnap.exists()) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Construct the update object with only the fields that are present in the request
    const updateData: { [key: string]: string | undefined } = {};
    if (title !== undefined) updateData.title = title;
    if (text !== undefined) updateData.content = text; // Remember to map 'text' back to 'content'
    if (image !== undefined) updateData.image = image;
    if (link !== undefined) updateData.link = link;

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    await updateDoc(blogRef, updateData);

    return NextResponse.json({ message: 'Blog updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to update blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const blogRef = doc(db, 'blogs', id);
    const blogSnap = await getDoc(blogRef);

    if (!blogSnap.exists()) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ id: blogSnap.id, ...blogSnap.data() }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const blogRef = doc(db, 'blogs', id);
    await deleteDoc(blogRef);

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
