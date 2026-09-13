import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export interface LeetCodeStatsData {
  user: {
    username: string;
    profileUrl: string;
    ranking: number;
    avatarUrl: string;
  };
  solved: {
    all: number;
    easy: number;
    medium: number;
    hard: number;
  };
  totalQuestions: {
    all: number;
    easy: number;
    medium: number;
    hard: number;
  };
  accuracy: {
    acceptanceRate: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
  };
  consistency: {
    streak: number;
    totalActiveDays: number;
  };
  topTags: Array<{
    name: string;
    solved: number;
  }>;
}

const DEFAULT_LEETCODE_STATS: LeetCodeStatsData = {
  user: {
    username: 'ashutosh0406',
    profileUrl: 'https://leetcode.com/u/ashutosh0406/',
    ranking: 1052423,
    avatarUrl:
      'https://assets.leetcode.com/users/ashutosh0406/avatar_1783796482.png',
  },
  solved: {
    all: 164,
    easy: 47,
    medium: 97,
    hard: 20,
  },
  totalQuestions: {
    all: 3400,
    easy: 860,
    medium: 1800,
    hard: 840,
  },
  accuracy: {
    acceptanceRate: 81.2,
    totalSubmissions: 266,
    acceptedSubmissions: 216,
  },
  consistency: {
    streak: 7,
    totalActiveDays: 49,
  },
  topTags: [
    { name: 'Array', solved: 97 },
    { name: 'String', solved: 34 },
    { name: 'Hash Table', solved: 32 },
    { name: 'Two Pointers', solved: 30 },
    { name: 'Math', solved: 28 },
    { name: 'Sorting', solved: 25 },
    { name: 'Binary Search', solved: 22 },
    { name: 'Dynamic Programming', solved: 20 },
    { name: 'Linked List', solved: 15 },
    { name: 'Tree', solved: 12 },
    { name: 'Greedy', solved: 12 },
    { name: 'DFS', solved: 11 },
  ],
};

const USERNAME = 'ashutosh0406';

const LEETCODE_GRAPHQL_QUERY = `
query getUserProfile($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: $username) {
    username
    profile {
      ranking
      userAvatar
    }
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
      totalSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    userCalendar {
      streak
      totalActiveDays
    }
    tagProblemCounts {
      advanced {
        tagName
        problemsSolved
      }
      intermediate {
        tagName
        problemsSolved
      }
      fundamental {
        tagName
        problemsSolved
      }
    }
  }
}
`;

import { syncService } from '@/platform/integrations/sync.service';

export async function GET() {
  // 1. Primary path: Fast local database snapshot (0ms latency, zero external rate limit)
  try {
    const snapshot = await syncService.getSnapshot<LeetCodeStatsData>('leetcode_overview');
    if (snapshot.data) {
      return NextResponse.json(snapshot.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }
  } catch (err) {
    console.warn('[leetcode-stats] Snapshot read error, falling back:', err);
  }

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-LeetCode-Fetcher',
      },
      body: JSON.stringify({
        query: LEETCODE_GRAPHQL_QUERY,
        variables: { username: USERNAME },
      }),
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(DEFAULT_LEETCODE_STATS);
    }

    const data = await res.json();
    const matchedUser = data?.data?.matchedUser;

    if (!matchedUser) {
      return NextResponse.json(DEFAULT_LEETCODE_STATS);
    }

    const stats: LeetCodeStatsData = JSON.parse(
      JSON.stringify(DEFAULT_LEETCODE_STATS),
    );

    // Profile info
    if (matchedUser.profile?.ranking) {
      stats.user.ranking = matchedUser.profile.ranking;
    }
    if (matchedUser.profile?.userAvatar) {
      stats.user.avatarUrl = matchedUser.profile.userAvatar;
    }

    // Solved counts
    const acNum = matchedUser.submitStats?.acSubmissionNum;
    if (Array.isArray(acNum)) {
      acNum.forEach(
        (item: { difficulty: string; count: number; submissions: number }) => {
          if (item.difficulty === 'All') stats.solved.all = item.count;
          if (item.difficulty === 'Easy') stats.solved.easy = item.count;
          if (item.difficulty === 'Medium') stats.solved.medium = item.count;
          if (item.difficulty === 'Hard') stats.solved.hard = item.count;
        },
      );
    }

    // Acceptance rate
    const totalSub = matchedUser.submitStats?.totalSubmissionNum?.find(
      (item: { difficulty: string }) => item.difficulty === 'All',
    );
    const acSub = acNum?.find(
      (item: { difficulty: string }) => item.difficulty === 'All',
    );

    if (totalSub && acSub && totalSub.submissions > 0) {
      stats.accuracy.totalSubmissions = totalSub.submissions;
      stats.accuracy.acceptedSubmissions = acSub.submissions;
      stats.accuracy.acceptanceRate = Number(
        ((acSub.submissions / totalSub.submissions) * 100).toFixed(1),
      );
    }

    // Calendar
    if (matchedUser.userCalendar) {
      if (typeof matchedUser.userCalendar.streak === 'number') {
        stats.consistency.streak = matchedUser.userCalendar.streak;
      }
      if (typeof matchedUser.userCalendar.totalActiveDays === 'number') {
        stats.consistency.totalActiveDays =
          matchedUser.userCalendar.totalActiveDays;
      }
    }

    // Question totals
    const allQuestions = data?.data?.allQuestionsCount;
    if (Array.isArray(allQuestions)) {
      allQuestions.forEach((q: { difficulty: string; count: number }) => {
        if (q.difficulty === 'All') stats.totalQuestions.all = q.count;
        if (q.difficulty === 'Easy') stats.totalQuestions.easy = q.count;
        if (q.difficulty === 'Medium') stats.totalQuestions.medium = q.count;
        if (q.difficulty === 'Hard') stats.totalQuestions.hard = q.count;
      });
    }

    // Tags
    const tags = matchedUser.tagProblemCounts;
    if (tags) {
      const combined: Array<{ name: string; solved: number }> = [];
      ['fundamental', 'intermediate', 'advanced'].forEach((level) => {
        if (Array.isArray(tags[level])) {
          tags[level].forEach(
            (t: { tagName: string; problemsSolved: number }) => {
              combined.push({ name: t.tagName, solved: t.problemsSolved });
            },
          );
        }
      });
      combined.sort((a, b) => b.solved - a.solved);
      if (combined.length > 0) {
        stats.topTags = combined.slice(0, 12);
      }
    }

    return NextResponse.json(stats);
  } catch (err) {
    console.error('Error fetching LeetCode stats:', err);
    return NextResponse.json(DEFAULT_LEETCODE_STATS);
  }
}
