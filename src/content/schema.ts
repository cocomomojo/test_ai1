import { z } from "zod";

export const hobbyHighlightSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1)
});

export const hobbySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  summary: z.string().min(1),
  detail: z.string().min(1),
  status: z.enum(["active", "incubating"]),
  cadence: z.string().min(1),
  currentFocus: z.string().min(1),
  highlights: z.array(hobbyHighlightSchema).min(1),
  firstReleaseItems: z.array(z.string().min(1)).min(2)
});

export const hobbiesSchema = z.array(hobbySchema);

export type Hobby = z.infer<typeof hobbySchema>;
