import React from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

/**
 * LogoCloud Component
 * Uses InfiniteSlider to display a moving row of sponsor logos.
 */
export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,black,transparent)]",
        className
      )}
    >
      <InfiniteSlider gap={64} reverse>
        {logos.map((logo) => (
          <div key={`logo-${logo.alt}`} className="flex items-center justify-center px-4">
            <img
              alt={logo.alt}
              className="pointer-events-none h-8 md:h-10 w-auto select-none opacity-70 hover:opacity-100 transition-opacity grayscale dark:brightness-0 dark:invert"
              height={logo.height || 40}
              loading="lazy"
              src={logo.src}
              width={logo.width || 150}
            />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}