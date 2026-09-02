import Image from "next/image";

import { SectionCard } from "@/components/personal/SectionCard";

type DogPhotoSlot =
  | "feature"
  | "portrait"
  | "detail-one"
  | "detail-two"
  | "detail-three";

type DogPhoto = {
  src: string;
  alt: string;
  slot: DogPhotoSlot;
  objectPosition: string;
  preserveFullPhoto?: boolean;
};

const dogPhotos: DogPhoto[] = [
  {
    src: "/images/dog/dog-1.webp",
    alt: "My dog walking toward the camera on a driveway",
    slot: "feature",
    objectPosition: "50% 50%",
    preserveFullPhoto: true
  },
  {
    src: "/images/dog/dog-2.webp",
    alt: "My dog stretching across a sofa and looking up",
    slot: "portrait",
    objectPosition: "50% 50%"
  },
  {
    src: "/images/dog/dog-3.webp",
    alt: "My dog smiling at the camera",
    slot: "detail-one",
    objectPosition: "50% 50%"
  },
  {
    src: "/images/dog/dog-4.webp",
    alt: "My dog relaxing beside a blue ball",
    slot: "detail-two",
    objectPosition: "50% 50%"
  },
  {
    src: "/images/dog/dog-5.webp",
    alt: "My dog sitting behind a plush toy",
    slot: "detail-three",
    objectPosition: "50% 50%"
  }
];

type DogPhotoSectionProps = {
  isDark: boolean;
};

export function DogPhotoSection({ isDark }: DogPhotoSectionProps) {
  return (
    <SectionCard
      id="my-dog"
      title="My Dog, Peanut"
      subtitle="A few favorite moments with my sidekick"
      isDark={isDark}
    >
      <ul className="dog-photo-grid" aria-label="Dog photo collage">
        {dogPhotos.map((photo) => (
          <li
            key={photo.src}
            className={`dog-photo-tile dog-photo-tile--${photo.slot}`}
          >
            {photo.preserveFullPhoto ? (
              <Image
                src={photo.src}
                alt=""
                aria-hidden="true"
                fill
                sizes={getPhotoSizes(photo.slot)}
                quality={90}
                loading="lazy"
                className="dog-photo-backdrop object-cover"
                style={{ objectPosition: photo.objectPosition }}
              />
            ) : null}
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={getPhotoSizes(photo.slot)}
              quality={90}
              loading="lazy"
              className={`dog-photo-image ${
                photo.preserveFullPhoto ? "object-contain" : "object-cover"
              }`}
              style={{ objectPosition: photo.objectPosition }}
            />
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

function getPhotoSizes(slot: DogPhotoSlot): string {
  if (slot === "feature") {
    return "(max-width: 767px) calc(100vw - 6rem), (max-width: 1152px) 70vw, 780px";
  }

  if (slot === "portrait") {
    return "(max-width: 767px) calc(50vw - 3rem), (max-width: 1152px) 24vw, 270px";
  }

  return "(max-width: 767px) calc(50vw - 3rem), (max-width: 1152px) 23vw, 250px";
}
