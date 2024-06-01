export type VerificationLevel = 'orb' | 'device';
export type PostState = 'onChallenge' | 'undefined' | 'confirmed' | 'bad';

export type User = {
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  verificationLevel: VerificationLevel;
  worldBalance: number;
  todayAvailableVoteCount: number;
  votedAt: number;
  reliability: {
    total: number;
    onChallenge: number;
    undefined: number;
    confirmed: number;
    bad: number;
    score: number | undefined;
  }
  likedCount: number;
  successVoteCount: number;
  failVoteCount: number;
  badPostCount: number;
}

export type Post = {
  id: number;
  content: string;
  createdAt: number;
  state: PostState,
  vote: {
    good: number;
    bad: number;
    goodVoterEmails: string[];
    badVoterEmails: string[];
  }
  like: {
    count: number;
    userEmails: string[];
  }
  claimed: boolean;
  replies: Reply[];
  userEmail: string;
}

export type Reply = {
  content: string;
  createdAt: number;
  userEmail: string;
}

export type Session = {
  userEmail: string;
  token: string;
  expireAt: number;
}
