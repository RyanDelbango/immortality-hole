import { type NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'offerings'));
    const offerings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(offerings);
  } catch (error) {
    console.error('Failed to fetch offerings:', error);
    return NextResponse.json({ error: 'Failed to fetch offerings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const docRef = await addDoc(collection(db, 'offerings'), body);
    return NextResponse.json({ id: docRef.id, ...body });
  } catch (error) {
    console.error('Failed to create offering:', error);
    return NextResponse.json({ error: 'Failed to create offering' }, { status: 500 });
  }
}
