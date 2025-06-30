import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { collection: string; id: string } }
) {
  try {
    const { collection, id } = params;

    if (!['blogs', 'offerings', 'messages'].includes(collection)) {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
    }

    await deleteDoc(doc(db, collection, id));

    return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
