export type IssueStatus = 'REPORTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';

export type UserRole = 'CITIZEN' | 'ADMIN' | 'OFFICER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  ward?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  userId?: string;

  assignedToId?:string | null;  //identifies the user in db.

  assignedTo?:{  //contains the officer's details when the backend returns the related user
    id:string;
    name:string;
    email:string;
  } | null;
  user?: {
    name: string;
    email: string;
    role: UserRole;
  };
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  department?: string;
  imageUrl?: string;
  upvotes?: number;
}

export interface CivicStats {
  totalIssues: number;
  reported: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  avgResolutionDays: number;
  activeWards: number;
}
