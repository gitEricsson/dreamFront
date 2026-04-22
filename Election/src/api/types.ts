export type User = {
  id: string;
  name: string;
  email: string;
};

export type ElectionStatus = 'PENDING' | 'STARTED' | 'ENDED';

export type Option = {
  id: string;
  name: string;
};

export type Election = {
  id: string;
  title: string;
  description: string;
  status: ElectionStatus;
  endDate: string;
  options: Option[];
};

export type CreateElectionInput = {
  title: string;
  description: string;
  creatorId: string;
  startDate: string;
  endDate: string;
  options: string[];
};

export type RegisterUserInput = {
  name: string;
  email: string;
};

export type CastVoteInput = {
  userId: string;
  electionId: string;
  optionId: string;
};

export type Winner = {
  id: string;
  electionId: string;
  name: string;
};

export type ElectionResults = {
  electionTitle: string;
  optionVotes: Record<string, number>;
  winnerName: string;
};
