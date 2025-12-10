import type {Track} from "types/types.ts";

export const getTracks = async (): Promise<{ tracks: Track[] }> => {
  const response = await fetch(`${import.meta.env.BASE_URL}tracks.json`);

  if (!response.ok) {
    throw new Error("Failed to fetch tracks");
  }

  return await response.json();
};
