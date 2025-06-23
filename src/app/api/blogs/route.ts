import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
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
    return NextResponse.json(blogs);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error fetching blogs: ${errorMessage}`, { details: error });
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error', error: errorMessage }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
