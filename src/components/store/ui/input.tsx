import { FC } from "react";

interface Props {
  name: string;
  value: string | number;
  type: "text" | "number";
  placeholder?: string;
  onChange: (value: string | number) => void;
  readOnly?: boolean;
}

const Input: FC<Props> = ({
  name,
  value,
  type,
  placeholder,
  onChange,
  readOnly,
}) => {
  return (
    <div className="w-full relative">
      <input
        type={type}
        className="w-full pr-6 pl-8 py-4 rounded-xl outline-none duration-200 ring-1 ring-transparent focus:ring-[#11BE86]"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  );
};

export default Input;
