import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

const VALID_COLLECTIONS = ['blogs', 'offerings', 'messages'];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ collection: string; id: string; }> }
) {
  const { collection, id } = await params;
  try {
    if (!VALID_COLLECTIONS.includes(collection)) {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
    }

    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() }, { status: 200 });
  } catch (error) {
    console.error(`Failed to fetch document from ${collection}:`, error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const { collection, id } = await params;
  try {
    if (!VALID_COLLECTIONS.includes(collection)) {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
    }

    const docRef = doc(db, collection, id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = await request.json() as Record<string, any>;
    
    // Using `any` here is a pragmatic choice for a generic handler where the body structure varies by collection.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = { ...body };
    if (collection === 'blogs' && body.text !== undefined) {
      updateData.content = body.text;
      delete updateData.text;
    }

    await updateDoc(docRef, updateData);

    return NextResponse.json({ message: 'Document updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to update document in ${collection}:`, error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const { collection, id } = await params;
  try {
    if (!VALID_COLLECTIONS.includes(collection)) {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
    }

    const docRef = doc(db, collection, id);
    await deleteDoc(docRef);

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error(`Failed to delete document from ${collection}:`, error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
