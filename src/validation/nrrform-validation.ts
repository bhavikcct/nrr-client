import { z } from "zod";

export const matchSchema = z
  .object({
    yourTeam: z.string().min(1, "Your Team is required"),
    oppositionTeam: z.string().min(1, "Opponent Team is required"),
    matchOvers: z.number().positive("Match Overs must be greater than zero"),
    desiredPosition: z.number().int().min(1).max(5, "Must be between 1 and 5"),
    tossResult: z.enum(["bat", "bowl"], {
      message: "Toss Result must be 'bat' or 'bowl'",
    }),
    runsScored: z.number().nonnegative("Runs cannot be negative"),
  })
  .refine((data) => data.yourTeam !== data.oppositionTeam, {
    message: "Your team and Opponent team must be different",
    path: ["oppositionTeam"],
  });

export type MatchSchemaData = z.infer<typeof matchSchema>;
