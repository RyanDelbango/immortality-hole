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
        timestamp: data.timestamp.toDate() // Convert to JS Date
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
      };
    });

    // Fetch offerings
    const offeringsSnapshot = await getDocs(collection(db, 'offerings'));
    const offerings = offeringsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
