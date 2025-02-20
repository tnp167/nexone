"use client";

import Image from "next/image";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import NoImage from "../../../../public/assets/images/no_image.png";
import { cn, getDominantColors, getGridClassName } from "@/lib/utils";
import { Trash } from "lucide-react";
import ColorPalette from "./ColorPalette";

interface ImagesPreviewGridProps {
  images: { url: string }[];
  onRemove: (value: string) => void;
  colors: { color: string }[]; //List of colors
  setColors: Dispatch<SetStateAction<{ color: string }[]>>; //Set the list of colors
}

const ImagePreviewGrid: FC<ImagesPreviewGridProps> = ({
  images,
  onRemove,
  colors,
  setColors,
}) => {
  const imagesLength = images.length;

  //Get the grid class name based on the number of images
  const GridClassName = getGridClassName(imagesLength);

  //Ectract image colors
  const [colorPalette, setColorPalette] = useState<string[][]>([]);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const palettes = await Promise.all(
          images.map(async (image) => {
            try {
              const colors = await getDominantColors(image.url);
              return colors;
            } catch (error) {
              console.error("Error fetching colors:", error);
              return [];
            }
          })
        );
        setColorPalette(palettes);
      } catch (error) {
        console.error("Error fetching colors:", error);
        return [];
      }
    };

    if (imagesLength > 0) {
      fetchColors();
    }
  }, [images]);

  if (imagesLength === 0) {
    return (
      <div>
        <Image
          src={NoImage}
          alt="No image"
          width={500}
          height={500}
          className="rounded-md"
        />
      </div>
    );
  } else {
    return (
      <div className="max-w-4xl">
        <div
          className={cn(
            "grid grid-cols-2 gap-1 h-[800px] overflow-hidden bg-white rounded-md",
            GridClassName
          )}
        >
          {images.map((image, idx) => (
            <div
              key={idx}
              className={cn(
                "grid relative w-full h-full group border border-gray-300",
                `grid_${imagesLength}_image_${idx + 1}`,
                {
                  "h-[266.66px]": imagesLength === 6,
                }
              )}
            >
              <Image
                src={image.url}
                alt="Product image"
                width={800}
                height={800}
                className="object-cover w-full h-full object-top"
              />
              {/* Actions */}
              <div
                className={cn(
                  "absolute inset-0 bg-white/55 cursor-pointer hidden group-hover:flex items-center justify-center flex-col gap-y-3 transition-all duration-500",
                  {
                    "!pb-[40%]": imagesLength === 1,
                  }
                )}
              >
                <ColorPalette
                  colors={colors}
                  extractedColors={colorPalette[idx]}
                  setColors={setColors}
                />
                {/* Delete Button */}
                <button
                  className="Btn"
                  type="button"
                  onClick={() => onRemove(image.url)}
                >
                  <div className="sign">
                    <Trash size={18} />
                  </div>
                  <div className="text">Delete</div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default ImagePreviewGrid;
