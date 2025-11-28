import { createContext, useContext, useState, ReactNode } from 'react';

interface FollowContextType {
  followedCoaches: Set<string>;
  followCoach: (coachId: string) => void;
  unfollowCoach: (coachId: string) => void;
  isFollowing: (coachId: string) => boolean;
  getFollowCount: (coachId: string) => number;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

// Mock follower counts for coaches
const initialFollowerCounts: Record<string, number> = {
  '1': 1250,
  '2': 890,
  '3': 2100,
  '4': 567,
  '5': 1450,
  '6': 780,
  '7': 920,
  '8': 1100,
};

export function FollowProvider({ children }: { children: ReactNode }) {
  const [followedCoaches, setFollowedCoaches] = useState<Set<string>>(new Set());
  const [followerCounts, setFollowerCounts] = useState<Record<string, number>>(initialFollowerCounts);

  const followCoach = (coachId: string) => {
    setFollowedCoaches((prev) => new Set(prev).add(coachId));
    setFollowerCounts((prev) => ({
      ...prev,
      [coachId]: (prev[coachId] || 0) + 1,
    }));
  };

  const unfollowCoach = (coachId: string) => {
    setFollowedCoaches((prev) => {
      const newSet = new Set(prev);
      newSet.delete(coachId);
      return newSet;
    });
    setFollowerCounts((prev) => ({
      ...prev,
      [coachId]: Math.max((prev[coachId] || 1) - 1, 0),
    }));
  };

  const isFollowing = (coachId: string) => {
    return followedCoaches.has(coachId);
  };

  const getFollowCount = (coachId: string) => {
    return followerCounts[coachId] || 0;
  };

  return (
    <FollowContext.Provider
      value={{
        followedCoaches,
        followCoach,
        unfollowCoach,
        isFollowing,
        getFollowCount,
      }}
    >
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  const context = useContext(FollowContext);
  if (context === undefined) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
}