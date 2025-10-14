import React from 'react';

function Loader() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-75"
      role="status"
      aria-live="polite"
      aria-label="Loading content..."
    >
      <div
        className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"
      ></div>
    </div>
  );
}

export default Loader;
