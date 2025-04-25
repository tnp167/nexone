import CouponIcon from "@/components/dashboard/icons/coupon";
import Link from "next/link";
import React from "react";
import SidelineItem from "./Item";
import CouponImg from "@/public/assets/images/sideline/couponn.png";
import WishlistImg from "@/public/assets/images/sideline/wishlist.png";
import HistoryImg from "@/public/assets/images/sideline/history.png";
import ShareImg from "@/public/assets/images/sideline/share.png";
import FeedbackImg from "@/public/assets/images/sideline/feedback.png";
import SocialShare from "../../shared/SocialShare";

const Sideline = () => {
  return (
    <div className="z-50 w-10 h-full absolute top-0 right-0 bg-gradient-to-t from-slate-500 to-slate-800 text-[16px] duration-100">
      <div className="fixed top-[35%] -translate-y-1/2 text-center">
        <Link
          href="/profile"
          className="group relative block w-[35px]  h-[35px] transition-all duration-100 ease-linear 
            bg-[url('/assets/images/sideline/gift.avif')] hover:bg-[url('/assets/images/sideline/gift-opened.avif')] bg-cover"
        >
          <span
            className="hidden group-hover:block absolute -left-[160px] top-0.5 bg-[#373737] text-white px-4
             py-[0.8rem] rounded-sm transition-all duration-500 ease-linear"
          >
            Check your profile
          </span>
          <div className="hidden group-hover:block w-0 h-0 border-[12px] border-transparent border-l-[#373737] border-r-0 absolute left-[-15px] top-[38%]  transition-all duration-500 ease-in-out" />
        </Link>
        <SidelineItem link="/profile" image={CouponImg}>
          Coupon
        </SidelineItem>
        <SidelineItem link="/profile" image={WishlistImg}>
          Wishlist
        </SidelineItem>
        <SidelineItem link="/profile" image={HistoryImg}>
          History
        </SidelineItem>
      </div>
      <div className="fixed top-[60%] -translate-y-1/2 text-left">
        <SidelineItem
          link="/"
          image={ShareImg}
          className="-bottom-9"
          arrowClassName="mt-28"
          w_fit
        >
          <SocialShare url="http://localhost:3000" quote="" isCol />
        </SidelineItem>
        <SidelineItem link="/feedback" image={FeedbackImg}>
          Feedback
        </SidelineItem>
      </div>
    </div>
  );
};

export default Sideline;
