import { NextResponse } from "next/server";
import { getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    // Fetch messages
    const messagesRef = collection(db, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));
    const messagesSnapshot = await getDocs(messagesQuery);
    const messages = messagesSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        message: data.message,
        timestamp: data.timestamp ? data.timestamp.toDate() : new Date() // Safely convert to JS Date
      };
    });

    // Fetch blogs
    const blogsCollection = collection(db, 'blogs');
    const blogSnapshot = await getDocs(blogsCollection);
    const blogs = blogSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        image: data.image,
        link: data.link,
        text: data.content, // Mapping 'content' to 'text'
        timestamp: data.timestamp ? data.timestamp.toDate() : new Date(0),
      };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Fetch offerings
    const offeringsRef = collection(db, 'offerings');
    const offeringsQuery = query(offeringsRef, orderBy('timestamp', 'desc'));
    const offeringsSnapshot = await getDocs(offeringsQuery);
    const offerings = offeringsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        offering: data.offering,
        timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
      };
    });

    return NextResponse.json({
      messages,
      blogs,
      offerings
    });
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
