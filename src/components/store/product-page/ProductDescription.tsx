"use client";

import DOMPurify from "dompurify";

interface Props {
  text: [string | undefined, string | null];
}
const ProductDescription = ({ text }: Props) => {
  const sanitizedDescription1 = DOMPurify.sanitize(text[0] || "");
  const sanitizedDescription2 = DOMPurify.sanitize(text[1] || "");
  return (
    <div className="pt-6">
      <div className="h-12">
        <h2 className="text-main-primary text-2xl font-bold">Description</h2>
      </div>
      <div dangerouslySetInnerHTML={{ __html: sanitizedDescription1 }} />
      <div dangerouslySetInnerHTML={{ __html: sanitizedDescription2 }} />
    </div>
  );
};

export default ProductDescription;
