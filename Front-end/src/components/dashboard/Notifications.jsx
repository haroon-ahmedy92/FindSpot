import React, { useState, useRef, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const sampleNotifications = [
  { id: 1, text: 'New item posted in Electronics', time: '2h ago' },
  { id: 2, text: 'Your item was claimed!', time: '1d ago' },
];

const Notifications = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="p-2 text-gray-600 hover:text-gray-800 relative"
        onClick={() => setOpen((prev) => !prev)}
      >
        <FaBell />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
          {sampleNotifications.length}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          {sampleNotifications.map((n) => (
            <Link
              key={n.id}
              to="#"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              <p>{n.text}</p>
              <span className="text-gray-400 text-xs">{n.time}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
