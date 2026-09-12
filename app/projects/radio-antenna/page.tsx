import type { Metadata } from "next";

import { RadioAntennaProjectPage } from "./RadioAntennaProjectPage";

const title = "DIY Radio Antenna | George DiNicola";
const description =
  "A handbuilt radio antenna paired with software-defined radio (SDR) to receive and explore amateur radio signals on a computer.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: "/projects/radio-antenna/",
    images: ["/me.png"]
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/me.png"]
  }
};

export default function Page() {
  return <RadioAntennaProjectPage />;
}
