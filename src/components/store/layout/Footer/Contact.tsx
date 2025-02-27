"use client";

import { Headset } from "lucide-react";
import React from "react";
import { SocialLogo } from "social-logos";
const Contact = () => {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-x-6">
          <Headset className="scale-[190%] stroke-slate-400" />
          <div className="flex flex-col">
            <span className="text=[#59645F] text-sm">
              Got Question ? Call us 24/7
            </span>
            <span className="text-2xl font-semibold">+44 123 456 7890</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <b>Contact Info</b>
        <span className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
        </span>
        <div className="flex flex-wrap mt-4 gap-2">
          <SocialLogo
            icon="facebook"
            size={28}
            fill="#7C7C7C"
            className="cursor-pointer hover:fill-slate-600"
          />
          <SocialLogo
            icon="whatsapp"
            size={28}
            fill="#7C7C7C"
            className="cursor-pointer hover:fill-slate-600"
          />
          <SocialLogo
            icon="pinterest"
            size={28}
            fill="#7C7C7C"
            className="cursor-pointer hover:fill-slate-600"
          />
          <SocialLogo
            icon="linkedin"
            size={28}
            fill="#7C7C7C"
            className="cursor-pointer hover:fill-slate-600"
          />
          <SocialLogo
            icon="instagram"
            size={28}
            fill="#7C7C7C"
            className="cursor-pointer hover:fill-slate-600"
          />
          <SocialLogo
            icon="youtube"
            size={28}
            fill="#7C7C7C"
            className="cursor-pointer hover:fill-slate-600"
          />
          <SocialLogo
            icon="telegram"
            size={28}
            fill="#7C7C7C"
            className="cursor-pointer hover:fill-slate-600"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
