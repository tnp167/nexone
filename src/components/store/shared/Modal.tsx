"use client";
import { X } from "lucide-react";
import { FC, SetStateAction, Dispatch, useRef } from "react";
import useOnClickOutside from "use-onclickoutside";

interface Props {
  title?: string;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}

const Modal: FC<Props> = ({ title, show, setShow, children }) => {
  const ref = useRef(null);
  const close = () => setShow(false);
  useOnClickOutside(ref, close);
  return show ? (
    <div className="size-full fixed inset-0 bg-gray-50/65 z-50">
      <div
        ref={ref}
        className="py-5 shadow-md rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-10 min-w-[800px] max-w-[900px]"
      >
        <div className="flex items-center justify-between border-b pb-2">
          <h1 className="text-xl font-bold">{title}</h1>
          <X
            className="w-4 h-4 cursor-pointer"
            onClick={() => setShow(false)}
          />
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  ) : null;
};

export default Modal;
