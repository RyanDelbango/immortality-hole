"use client";

import { useState, useEffect } from "react";

// Define types for our data
interface Blog {
  id: string;
  title: string;
  text: string;
  timestamp: string;
  image?: string;
  link?: string;
}

interface Offering {
  id: string;
  offering: string;
  timestamp: string;
}

interface Message {
  id: string;
  message: string;
  timestamp: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'blogs' | 'offerings' | 'messages'>('blogs');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/content');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setBlogs(data.blogs);
        setOfferings(data.offerings);
        setMessages(data.messages);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (collectionName: 'blogs' | 'offerings' | 'messages', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${collectionName.slice(0, -1)}?`)) return;

    try {
      const response = await fetch(`/api/content/${collectionName}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }

      if (collectionName === 'blogs') {
        setBlogs(blogs.filter(item => item.id !== id));
      } else if (collectionName === 'offerings') {
        setOfferings(offerings.filter(item => item.id !== id));
      } else if (collectionName === 'messages') {
        setMessages(messages.filter(item => item.id !== id));
      }

    } catch (error) {
      console.error('Failed to delete item:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Could not delete item.'}`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      );
    }

    let currentItems: (Blog | Offering | Message)[] = [];
    if (activeTab === 'blogs') currentItems = blogs;
    if (activeTab === 'offerings') currentItems = offerings;
    if (activeTab === 'messages') currentItems = messages;

    if (currentItems.length === 0) {
      return <p className="text-center text-gray-400">No {activeTab} found.</p>;
    }

    return (
      <ul className="divide-y divide-gray-700 mt-4">
        {currentItems.map((item) => (
          <li key={item.id} className="py-3 flex justify-between items-center">
            <div className="flex-1 min-w-0 mr-4">
              {activeTab === 'blogs' && 'title' in item && (
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 flex-shrink-0 ml-4">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-purple-300 hover:text-purple-100">{item.text}</p>
                  {item.image && <p className="text-sm text-gray-400 truncate">Image: {item.image}</p>}
                  {item.link && <p className="text-sm text-gray-400 truncate">Link: {item.link}</p>}
                </div>
              )}
              {activeTab === 'messages' && 'message' in item && (
                <p className="text-sm truncate">{item.message} - {new Date(item.timestamp).toLocaleString()}</p>
              )}
              {activeTab === 'offerings' && 'offering' in item && (
                <p className="text-sm truncate">{item.offering} - {new Date(item.timestamp).toLocaleString()}</p>
              )}
            </div>
            <button 
              onClick={() => handleDelete(activeTab, item.id)}
              className="btn btn-ghost btn-sm text-red-500"
              aria-label={`Delete ${activeTab.slice(0, -1)}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5.5 4v6m3-6v6m1.5-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-10 text-purple-400 tracking-wider">Dashboard</h1>
        
        <div className="flex justify-center mb-10">
          <div className="tabs tabs-boxed bg-gray-800/60 border border-gray-700">
            <a 
              className={`tab tab-lg transition-all duration-300 ${activeTab === 'blogs' ? 'tab-active bg-purple-600 text-white' : 'text-white'}`} 
              onClick={() => setActiveTab('blogs')}
              style={{ color: 'white' }}
            >
              Blogs
            </a> 
            <a 
              className={`tab tab-lg transition-all duration-300 ${activeTab === 'offerings' ? 'tab-active bg-purple-600 text-white' : 'text-white'}`} 
              onClick={() => setActiveTab('offerings')}
              style={{ color: 'white' }}
            >
              Offerings
            </a> 
            <a 
              className={`tab tab-lg transition-all duration-300 ${activeTab === 'messages' ? 'tab-active bg-purple-600 text-white' : 'text-white'}`} 
              onClick={() => setActiveTab('messages')}
              style={{ color: 'white' }}
            >
              Messages
            </a>
          </div>
        </div>

        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 shadow-2xl min-h-[36rem]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
