import Image from "next/image";

type GiftImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

export function GiftImage({ src, alt, sizes, priority = false, className = "", imageClassName = "" }: GiftImageProps) {
  return (
    <div className={`relative overflow-hidden bg-[#e9ddd3] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${imageClassName}`}
      />
    </div>
  );
}
