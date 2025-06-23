import React from 'react';
import Image from 'next/image';

interface BlogPostProps {
  title: string;
  image: string;
  link: string;
  text: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, image, link, text }) => {
  return (
    <div className="px-4">
      <h2 className="font-bold text-lg mb-2 text-center">{title}</h2>
      <Image src={image} alt={title} className="w-full h-auto mb-2 rounded" width={200} height={150} />
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all text-sm">Link</a>
      <p className="text-base mt-2 text-left">{text}</p>
    </div>
  );
};

export default BlogPost;
