

export enum RelationshipStatus {
  SINGLE = 'single',
  DATING = 'dating',
  MARRIED = 'married',
}

export interface Challenge {
  type: string;
  content: string;
  completed: boolean;
}

export interface UserStats {
  points: number;
  level: number;
  challengesCompleted: number;
}

export interface Comment {
  id: number;
  author: string;
  text: string;
}

export interface LoveWallPost {
  id: number;
  author: string;
  message: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  likes: number;
  comments: Comment[];
}

export interface SingleProfile {
  uid: string;
  name: string;
  age: number;
  imageUrl: string;
  bio: string;
  interests: string[];
}

export interface CoupleProfile {
  names: [string, string];
  imageUrl: string;
  sharedBio: string;
}

export interface UserData {
    uid: string;
    email: string;
    relationshipStatus: RelationshipStatus;
    stats: UserStats;
    singleProfile: SingleProfile | null;
    coupleProfile: CoupleProfile | null;
    hasCompletedOnboarding: boolean;
    lastChallengeDate: string | null;
    dailyChallenges: Challenge[];
}