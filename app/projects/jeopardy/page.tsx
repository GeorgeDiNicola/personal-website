import type { Metadata } from "next";

import { JeopardyProjectPage } from "./JeopardyProjectPage";

const title = "Jeopardy! Prediction Model | George DiNicola";
const description =
  "A machine learning model predicting whether the returning Jeopardy! champion will win their next game, with live predictions and a history of results.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: "/projects/jeopardy/",
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
  return <JeopardyProjectPage />;
}
