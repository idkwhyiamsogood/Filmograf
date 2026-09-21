import React from "react";

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "width" | "height"> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

export const Image: React.FC<ImageProps> = ({
  fill,
  priority,
  quality,
  className,
  ...props
}) => {
  return (
    <img
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={fill ? `absolute inset-0 w-full h-full ${className ?? ""}` : className}
      {...props}
    />
  );
};

export default Image;
