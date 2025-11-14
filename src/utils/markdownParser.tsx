
import React from 'react';

export const parseMarkdown = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|###\s*\*\*.*?\*\*|\*.*?\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('### ** ') && part.endsWith(' **')) {
      // Heading
      const heading = part.replace(/^### \*\* | \*\*$/g, '');
      return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{heading}</h3>;
    } else if (part.startsWith('**') && part.endsWith('**')) {
      // Bold text
      const bold = part.replace(/^\*\* | \*\*$/g, '');
      return <strong key={index} className="font-bold">{bold}</strong>;
    } else if (part.startsWith('*') && part.endsWith('*')) {
      // Italic text
      const italic = part.replace(/^\* | \*$/g, '');
      return <em key={index} className="italic">{italic}</em>;
    }
    return part;
  });
};
