import Newsletter from "./Newsletter";
import Contact from "./Contact";
import Links from "./Links";
import { getSubcategories } from "@/queries/subCategory";

const Footer = async () => {
  const subs = await getSubcategories(10, true);
  return (
    <div className="w-full bg-white">
      <Newsletter />
      <div className="max-w-[1430px] mx-auto">
        <div className="p-5">
          <div className="grid md:grid-cols-2 md:gap-x-5">
            <Contact />
            <Links subs={subs} />
          </div>
        </div>
      </div>
      <div className="px-2 bg-gradient-to-r from-slate-100 to-slate-200">
        <div className="mx-auto flex items-center max-w-[1430px] h-7">
          <span className="text-sm">
            <b>@ NexOne</b> - All Rights Reserved
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
