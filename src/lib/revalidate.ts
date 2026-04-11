import { revalidatePath } from "next/cache";

export function safeRevalidatePaths(paths: string[]) {
  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch (error) {
      console.error(`Failed to revalidate path: ${path}`, error);
    }
  }
}
