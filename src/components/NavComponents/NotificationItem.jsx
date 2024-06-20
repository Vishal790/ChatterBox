import React, { memo } from "react";

const NotificationItem = ({ sender, _id, handler }) => {
  return (
    <li className="p-2 border-b border-gray-300 flex gap-x-10 flex-col sm:flex-row items-center justify-between">
      <div className="flex items-center gap-x-5">
        <img
          src={sender.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <h1 className="ml-2">{sender.name} sent you a friend request</h1>
      </div>
      <div className="flex gap-x-2  flex-col  sm:flex-row gap-y-4">
        <button
          className="px-3 py-1 bg-caribbeangreen-600 text-white rounded"
          onClick={() => handler({ _id, accept: true })}
        >
          Accept
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={() => handler({ _id, accept: false })}
        >
          Reject
        </button>
      </div>
    </li>
  );
};

export default memo(NotificationItem);
