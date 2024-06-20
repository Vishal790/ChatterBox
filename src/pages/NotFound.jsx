import React from 'react'
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center flex-col gap-y-10">
      <img
        src="https://cdn1.iconfinder.com/data/icons/photo-stickers-words/128/word_18-1024.png"
        alt="Not Found"
        className="not-found-image w-[500px]"
      />
      <p className=' text-white'>
        <Link to="/">Go to Home </Link>
        
      </p>
    </div>
  );
}

export default NotFound