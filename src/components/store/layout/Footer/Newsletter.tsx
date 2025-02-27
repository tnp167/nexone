import React from "react";
import { SendIcon } from "@/components/store/icons";

const Newsletter = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-5">
      <div className="max-w-[1430px] mx-auto">
        <div className="flex flex-col gap-y-4 xl:flex-row items-center text-white">
          {/* left */}
          <div className="flex items-center xl:w-[60%]">
            <h5 className="flex items-center gap-x-2">
              <div className="scale-125 mr-2">
                <SendIcon />
              </div>
              <span className="md:text-xl">Sign up for Newsletter</span>
              <span className="ml-10">
                ...and receive &nbsp;
                <b>£5 coupon for first order</b>
              </span>
            </h5>
          </div>
          {/* Right */}
          <div className="flex w-full xl:flex-1">
            <input
              type="text"
              placeholder="Enter your email address"
              className="w-full h-10 pl-6 bg-white rounded-l-full outline-none text-black"
            />
            <span className="h-10 w-24 text-sm grid place-content-center rounded-r-full bg-purple-500 cursor-pointer">
              Subscribe
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
