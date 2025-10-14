import React, { useState } from 'react';

interface Props {
  text: string;
  wordLimit: number;
}

const ReadMoreText = ({ text, wordLimit = 5 }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const words = text.split(' ');
  const shouldTruncate = words.length > wordLimit;

  const displayedText = isExpanded || !shouldTruncate
    ? text
    : words.slice(0, wordLimit).join(' ') + '...';

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={'flex pt-1'} onClick={toggleExpand}>
      <p className="text-ring leading-3.5" onClick={toggleExpand}>
        {displayedText}
        {shouldTruncate && (
          <span
            onClick={toggleExpand}
            className="text-primary"
          >
          {isExpanded ? 'Read Less' : 'Read More'}
        </span>
        )}
      </p>

    </div>
  );
};

export default ReadMoreText;
