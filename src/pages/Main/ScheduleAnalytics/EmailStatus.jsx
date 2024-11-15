import React from 'react';

const EmailStatus = () => {
  return (
    <div className="bg-gray-100 p-4">
      <h3 className="font-bold mb-2">Email Send Status</h3>
      <p>Status: Sent</p>
      <button className="bg-blue-500 text-white py-1 px-4 mt-2 rounded">Send Again</button>
    </div>
  );
};

export default EmailStatus;
