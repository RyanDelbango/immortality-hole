import { type NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET() {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        message: data.message,
        timestamp: data.timestamp.toDate() // Convert to JS Date
      };
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newMessage = {
      ...body,
      timestamp: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, 'messages'), newMessage);
    
    const responseBody = {
      id: docRef.id,
      message: newMessage.message,
      timestamp: newMessage.timestamp.toDate(), // Convert to JS Date object
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error('Failed to create message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
