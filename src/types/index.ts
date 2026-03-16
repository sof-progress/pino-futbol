import { Category, Match, Team, MatchStatus, Venue } from '@prisma/client';

export type MatchWithTeams = Match & {
    homeTeam: Team;
    awayTeam: Team;
    category?: Category;
    venue?: Venue | null;
};

export { MatchStatus };
