export type PledgeStatus = "active" | "done" | "failed";

export interface Pledge {
  id: string;
  slug: string;
  goal: string;
  author_name: string;
  deadline: string;
  created_at: string;
  completed_at: string | null;
  status: PledgeStatus;
}
