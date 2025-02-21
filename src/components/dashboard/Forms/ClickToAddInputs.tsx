import { Dispatch, FC, SetStateAction } from "react";
import { Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface Detail {
  [key: string]: string | number | boolean | undefined;
}

export interface ClickToAddProps {
  details: Detail[];
  setDetails: Dispatch<SetStateAction<Detail[]>>;
  initialDetail?: Detail;
  header: string;
}

const ClickToAddInputs: FC<ClickToAddProps> = ({
  details,
  setDetails,
  initialDetail = {},
  header,
}) => {
  const handleDetailsChange = (
    index: number,
    property: string,
    value: string | number
  ) => {
    const updatedDetails = details.map((detail, idx) =>
      idx === index ? { ...detail, [property]: value } : detail
    );
    setDetails(updatedDetails);
  };

  const handleAddDetail = () => {
    setDetails([...details, { ...initialDetail }]);
  };

  const handleRemove = (index: number) => {
    if (details.length === 1) return;
    const updatedDetails = details.filter((_, idx) => idx !== index);
    setDetails(updatedDetails);
  };

  const PlusButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <button
        type="button"
        title="Add new detail"
        className="group cursor-pointer outline-none hover:rotate-90 duration-300"
        onClick={onClick}
      >
        {/* Plus icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50px"
          height="50px"
          viewBox="0 0 24 24"
          className="w-8 h-8 stroke-blue-400 fill-none group-hover:fill-blue-primary group-active:stroke-blue-200 group-active:fill-blue-700 group-active:duration-0 duration-300"
        >
          <path
            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
            strokeWidth="1.5"
          />
          <path d="M8 12H16" strokeWidth="1.5" />
          <path d="M12 16V8" strokeWidth="1.5" />
        </svg>
      </button>
    );
  };

  const MinusButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <button
        type="button"
        title="Remove detail"
        className="group cursor-pointer outline-none hover:rotate-90 duration-300"
        onClick={onClick}
      >
        {/* Minus icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50px"
          height="50px"
          viewBox="0 0 24 24"
          className="w-8 h-8 stroke-blue-400 fill-none group-hover:fill-white group-active:stroke-blue-200 group-active:fill-blue-700 group-active:duration-0 duration-300"
        >
          <path
            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
            strokeWidth="1.5"
          />
          <path d="M8 12H16" strokeWidth="1.5" />
        </svg>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div>{header}</div>
      {details.length === 0 && <PlusButton onClick={handleAddDetail} />}
      {details.map((detail, idx) => (
        <div key={idx} className="flex items-center gap-x-4">
          {Object.keys(detail).map((property) => (
            <div key={property} className="flex items-center gap-x-2">
              <Input
                className="w-28"
                type={typeof detail[property] === "number" ? "number" : "text"}
                name={property}
                placeholder={property}
                value={detail[property] as string}
                min={typeof detail[property] === "number" ? 0 : undefined}
                step="0.01"
                onChange={(e) =>
                  handleDetailsChange(
                    idx,
                    property,
                    typeof detail[property] === "number"
                      ? parseFloat(e.target.value)
                      : e.target.value
                  )
                }
              />
            </div>
          ))}
          <MinusButton onClick={() => handleRemove(idx)} />
          <PlusButton onClick={handleAddDetail} />
        </div>
      ))}
    </div>
  );
};

export default ClickToAddInputs;
