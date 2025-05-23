"use client";

import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Share2, // Generic share icon for a title
} from "lucide-react";

interface SocialShareButtonsProps {
  pageUrl: string;
  pageTitle: string;
  title?: string; // Optional title for the section
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  pageUrl,
  pageTitle,
  title = "Share this Campaign",
}) => {
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(pageTitle);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=Check out this campaign:%20${encodedUrl}`,
  };

  return (
    <div className="py-6 bg-white shadow-md rounded-lg dark:bg-gray-800">
      <div className="px-6">
        {title && (
          <h3 className="mb-4 text-xl font-semibold flex items-center text-gray-800 dark:text-white">
            <Share2 className="mr-2 h-5 w-5" />
            {title}
          </h3>
        )}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="flex-1 sm:flex-none"
          >
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
            >
              <Facebook className="mr-2 h-5 w-5" /> Facebook
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="flex-1 sm:flex-none"
          >
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter"
            >
              <Twitter className="mr-2 h-5 w-5" /> Twitter
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="flex-1 sm:flex-none"
          >
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="flex-1 sm:flex-none"
          >
            <a href={shareLinks.email} aria-label="Share via Email">
              <Mail className="mr-2 h-5 w-5" /> Email
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
