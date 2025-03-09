"use client";

// React, Next.js
import { FC, useEffect, useState, useRef } from "react";
import Image from "next/image";

// Cloudinary
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  maxImages: number;
}

const ImageUploadStore: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  maxImages,
}) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        {Array.from({ length: maxImages }, (_, index) => index).map((index) => (
          <div key={index} className="relative">
            {/* Delete image btn */}
            <div className="z-10 absolute top-2 right-2">
              <Button
                //  onClick={() => onRemove(imageUrl)}
                type="button"
                variant="destructive"
                size="icon"
                className="rounded-full hidden"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            {/* Image */}
            {value[index] ? (
              <div className="bg-gray-200">
                <Image
                  width={80}
                  height={80}
                  className="object-cover w-20 h-20 rounded-md"
                  alt=""
                  src={value[index]}
                />
              </div>
            ) : (
              <div
                className="w-20 h-20 bg-gray-200 grid place-items-center cursor-pointer rounded-md"
                onClick={() => btnRef?.current?.click()}
              >
                <Plus className="text-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>
      <CldUploadWidget onSuccess={onUpload} uploadPreset="labpcmihw">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <>
              <button
                type="button"
                disabled={disabled}
                ref={btnRef}
                onClick={onClick}
                className="hidden"
              ></button>
            </>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUploadStore;
