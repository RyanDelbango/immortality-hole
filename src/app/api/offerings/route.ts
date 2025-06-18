import { type NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
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
    const { offering } = await req.json();
    if (!offering) {
      return NextResponse.json({ error: 'Offering text is required' }, { status: 400 });
    }

    const newOffering = {
      offering: offering,
      timestamp: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'offerings'), newOffering);

    // Return the full object so the client can use the server-generated timestamp
    return NextResponse.json({ 
      id: docRef.id, 
      offering: newOffering.offering,
      timestamp: newOffering.timestamp.toDate().toISOString() // Convert to a serializable format
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding document: ', error);
    return NextResponse.json({ error: 'Failed to submit offering' }, { status: 500 });
  }
}
