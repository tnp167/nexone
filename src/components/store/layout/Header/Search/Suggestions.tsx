import { SearchResult } from "@/lib/types";
import Image from "next/image";
import { FC } from "react";
import { useRouter } from "next/navigation";
interface Props {
  suggestions: SearchResult[];
  query: string;
}

const SearchSuggestions: FC<Props> = ({ suggestions, query }) => {
  const router = useRouter();
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi"); //gi is global and case insensitive
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} className="text-orange-background">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const handlePush = (link: string) => {
    router.push(link);
  };

  return (
    <div className="absolute top-10 w-full rounded-3xl bg-white text-main-primary shadow-2xl overflow-hidden !z-50">
      <div className="py-2">
        <ul>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.name}
              className="w-full h-20 px-6 cursor-pointer hover:bg-gray-400 flex items-center gap-x-2"
              onClick={() => handlePush(suggestion.link)}
            >
              <Image
                src={suggestion.image}
                alt={suggestion.name}
                width={100}
                height={100}
                className="size-16 rounded-md object-cover"
              />
              <div>
                <span className="text-sm leading-6 my-2">
                  {highlightText(suggestion.name, query)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default SearchSuggestions;
