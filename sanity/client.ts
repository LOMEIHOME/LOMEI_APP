import { createClient, type SanityClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset, apiVersion } from "./env";

// Cliente lazy: solo se crea si Sanity está configurado
let _client: SanityClient | null = null;
let _builder: ReturnType<typeof imageUrlBuilder> | null = null;

function isSanityConfigured(): boolean {
  return !!projectId && projectId !== "TU_PROJECT_ID";
}

export function getClient(): SanityClient {
  if (!_client) {
    _client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    });
  }
  return _client;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  if (!_builder) {
    _builder = imageUrlBuilder(getClient());
  }
  return _builder.image(source);
}

export { isSanityConfigured };
