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
  const [isSaving, setIsSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editedBlog, setEditedBlog] = useState<Partial<Blog>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/content');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        // Sort all data by timestamp descending on fetch
        setBlogs(data.blogs.sort((a: Blog, b: Blog) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        setOfferings(data.offerings.sort((a: Offering, b: Offering) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        setMessages(data.messages.sort((a: Message, b: Message) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (blog: Blog) => {
    setEditingBlogId(blog.id);
    setEditedBlog(blog);
    setShowCreateForm(false); // Hide create form if it's open
  };

  const handleCancelEdit = () => {
    setEditingBlogId(null);
    setEditedBlog({});
  };
  
  const handleCancelCreate = () => {
      setShowCreateForm(false);
      setEditedBlog({});
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async (id: string | null) => {
    setIsSaving(true);
    try {
      const isCreating = id === null;
      const body = JSON.stringify({
        title: editedBlog.title,
        text: editedBlog.text,
        image: editedBlog.image,
        link: editedBlog.link,
      });

      const response = await fetch(isCreating ? '/api/content/blogs' : `/api/content/blogs/${id}`, {
        method: isCreating ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) {
        throw new Error('Failed to save blog post');
      }

      if (isCreating) {
        const result = await response.json();
        const newBlog = { 
            id: result.id,
            title: editedBlog.title || '',
            text: editedBlog.text || '',
            image: editedBlog.image,
            link: editedBlog.link,
            timestamp: new Date().toISOString() 
        } as Blog;
        setBlogs(prev => [newBlog, ...prev].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        handleCancelCreate();
      } else {
        const updatedBlog = { ...blogs.find(b => b.id === id), ...editedBlog } as Blog;
        setBlogs(prev => prev.map(blog => (blog.id === id ? updatedBlog : blog)));
        handleCancelEdit();
      }
    } catch (error) {
      console.error('Failed to save blog:', error);
      alert('Failed to save blog post.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (collectionName: 'blogs' | 'offerings' | 'messages', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${collectionName.slice(0, -1)}?`)) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/content/${collectionName}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete item and could not parse error response' }));
        throw new Error(errorData.error || 'Failed to delete item');
      }

      if (collectionName === 'blogs') setBlogs(blogs.filter(item => item.id !== id));
      else if (collectionName === 'offerings') setOfferings(offerings.filter(item => item.id !== id));
      else if (collectionName === 'messages') setMessages(messages.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Could not delete item.'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const renderBlogForm = (blogId: string | null) => {
    const isCreating = blogId === null;
    const isCurrentlySaving = isSaving && (isCreating ? showCreateForm : editingBlogId === blogId);

    return (
        <div className="flex flex-col space-y-2 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div><label htmlFor="title" className="text-xs font-bold text-gray-400">Title</label><input type="text" name="title" id="title" value={editedBlog.title || ''} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" /></div>
            <div><label htmlFor="text" className="text-xs font-bold text-gray-400">Text</label><textarea name="text" id="text" value={editedBlog.text || ''} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" rows={4} /></div>
            <div><label htmlFor="image" className="text-xs font-bold text-gray-400">Image URL</label><input type="text" name="image" id="image" value={editedBlog.image || ''} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" /></div>
            <div><label htmlFor="link" className="text-xs font-bold text-gray-400\">Link URL</label><input type="text" name="link" id="link" value={editedBlog.link || ''} onChange={handleInputChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white" /></div>
            <div className="flex justify-end items-center space-x-2 mt-2">
                <button onClick={() => handleSaveClick(blogId)} className="btn btn-ghost btn-sm text-green-500" disabled={isSaving}>{isCurrentlySaving ? <span className="loading loading-spinner"></span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}</button>
                <button onClick={isCreating ? handleCancelCreate : handleCancelEdit} className="btn btn-ghost btn-sm text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
        </div>
    );
  };

  const renderContent = () => {
    if (loading) return (<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div></div>);
    
    if (activeTab !== 'blogs') {
        const currentItems: (Offering | Message)[] = activeTab === 'offerings' ? offerings : messages;
        if (currentItems.length === 0) return <p className="text-center text-gray-400">No {activeTab} found.</p>;
        return (
          <ul className="divide-y divide-gray-700 mt-4">
            {currentItems.map((item: Offering | Message) => (
              <li key={item.id} className="py-3 flex justify-between items-center">
                <div className="flex-1 min-w-0 mr-4">
                  {'message' in item ? <p className="text-sm truncate">{item.message}</p> : <p className="text-sm truncate">{(item as Offering).offering}</p>}
                  <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDelete(activeTab, item.id)} className="btn btn-ghost btn-sm text-red-500" aria-label={`Delete ${activeTab.slice(0, -1)}`} disabled={deletingId === item.id}>
                  {deletingId === item.id ? <span className="loading loading-spinner"></span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5.5 4v6m3-6v6m1.5-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                </button>
              </li>
            ))}
          </ul>
        );
    }

    // Blogs Tab
    return (
        <div>
            <div className="mb-4">
                {!showCreateForm && (
                    <button onClick={() => { setShowCreateForm(true); setEditingBlogId(null); setEditedBlog({}); }} className="btn btn-primary">Create New Post</button>
                )}
            </div>
            {showCreateForm && <div className="mb-4">{renderBlogForm(null)}</div>}
            {(blogs.length === 0 && !showCreateForm) && (<p className="text-center text-gray-400">No blogs found.</p>)}
            <ul className="divide-y divide-gray-700">
                {blogs.map((item) => (
                <li key={item.id} className="py-3">
                    {editingBlogId === item.id ? renderBlogForm(item.id) : (
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 mr-4 flex flex-col space-y-2">
                            <div className="flex justify-between items-center">
                                <p className="font-medium truncate">{item.title}</p>
                                <p className="text-xs text-gray-400 flex-shrink-0 ml-4">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                            <p className="text-sm text-purple-300 hover:text-purple-100">{item.text}</p>
                            {item.image && <p className="text-sm text-gray-400 truncate">Image: {item.image}</p>}
                            {item.link && <p className="text-sm text-gray-400 truncate">Link: {item.link}</p>}
                        </div>
                        <div className="flex items-center space-x-1">
                            <button onClick={() => handleEditClick(item)} className="btn btn-ghost btn-sm text-blue-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                            <button onClick={() => handleDelete('blogs', item.id)} className="btn btn-ghost btn-sm text-red-500" aria-label={`Delete blog`} disabled={deletingId === item.id}>
                            {deletingId === item.id ? <span className="loading loading-spinner"></span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5.5 4v6m3-6v6m1.5-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                        </button>
                        </div>
                    </div>
                    )}
                </li>
                ))}
            </ul>
        </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-10 text-purple-400 tracking-wider">Dashboard</h1>
        <div className="flex justify-center mb-10">
          <div className="tabs tabs-boxed bg-gray-800/60 border border-gray-700">
            <a className={`tab tab-lg transition-all duration-300 ${activeTab === 'blogs' ? 'tab-active bg-purple-600' : ''}`} onClick={() => setActiveTab('blogs')} style={{ color: 'white !important' }}>Blogs</a> 
            <a className={`tab tab-lg transition-all duration-300 ${activeTab === 'offerings' ? 'tab-active bg-purple-600' : ''}`} onClick={() => setActiveTab('offerings')} style={{ color: 'white !important' }}>Offerings</a> 
            <a className={`tab tab-lg transition-all duration-300 ${activeTab === 'messages' ? 'tab-active bg-purple-600' : ''}`} onClick={() => setActiveTab('messages')} style={{ color: 'white !important' }}>Messages</a>
          </div>
        </div>
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 shadow-2xl min-h-[36rem]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}