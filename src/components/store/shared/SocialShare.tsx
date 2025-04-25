"use client";

import { FC } from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  PinterestShareButton,
  PinterestIcon,
} from "next-share";
import { cn } from "@/lib/utils";
interface Props {
  url: string;
  quote: string;
  isCol?: boolean;
}

const SocialShare: FC<Props> = ({ url, quote, isCol }) => {
  return (
    <div
      className={cn("flex flex-wrap justify-center gap-2", isCol && "flex-col")}
    >
      <FacebookShareButton url={url} quote={quote} hashtag="NexOne">
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={quote} hashtags={["NexOne"]}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <WhatsappShareButton url={url} title={quote}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      <PinterestShareButton url={url} media={quote}>
        <PinterestIcon size={32} round />
      </PinterestShareButton>
    </div>
  );
};

export default SocialShare;
