// src/utils/sanity.js
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  // You can find your projectId in your Sanity Studio's sanity.cli.js file
  projectId: '021qtoci', 
  dataset: 'production',
  useCdn: true, // Use the edge cache for fast loading
  apiVersion: '2026-03-03', // Today's date
});

// Set up the image builder
const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}