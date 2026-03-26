// src/utils/sanity.js

import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const client = createClient({
  projectId: "021qtoci",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Correct image builder (new API)
const builder = createImageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}
