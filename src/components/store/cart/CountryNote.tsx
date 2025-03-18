import { Info } from "lucide-react";
import React from "react";

const CountryNote = ({ country }: { country: string }) => {
  return (
    <div className="w-full p-3 bg-green-100 flex items-center">
      <div className="size-8 border rounded-full border-green-200 flex flex-shrink-0 items-center justify-center">
        <Info className="stroke-green-300" />
      </div>
      <div className="pl-3 w-full">
        <div className="flex items-center justify-between">
          <p className="text-sm leading-none text-green-600">
            Shipping fees are calculated based on your country ({country}).{" "}
            <br />
            Please check the shipping fees before placing your order.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountryNote;
