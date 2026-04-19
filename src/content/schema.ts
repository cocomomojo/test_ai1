import { z } from "zod";

export const hobbyHighlightSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1)
});

export const hobbyMetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  note: z.string().min(1)
});

export const hobbyFocusRowSchema = z.object({
  theme: z.string().min(1),
  current: z.string().min(1),
  signal: z.string().min(1),
  nextAction: z.string().min(1)
});

export const hobbyInnovationSchema = z.object({
  title: z.string().min(1),
  combination: z.string().min(1),
  summary: z.string().min(1)
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
  snapshot: z.array(hobbyMetricSchema).min(3),
  highlights: z.array(hobbyHighlightSchema).min(1),
  focusTable: z.array(hobbyFocusRowSchema).min(3),
  innovationIdeas: z.array(hobbyInnovationSchema).min(2),
  draftAngles: z.array(z.string().min(1)).min(2),
  firstReleaseItems: z.array(z.string().min(1)).min(2),
  tags: z.array(z.string().min(1)).optional(),
  updatedAt: z.string().optional(),
  published: z.boolean().optional()
});

export const hobbiesSchema = z.array(hobbySchema);

export type Hobby = z.infer<typeof hobbySchema>;
