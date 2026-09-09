import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import SIH_UserProgress, { ISIHUserProgress } from "@/models/SIH_UserProgress";

export type PassportProgress = {
  points: number;
  visitedLocationIds: string[];
  badges: Array<{
    code: string;
    name: string;
    description: string;
    icon: string;
    tier: "bronze" | "silver" | "gold";
    earnedAt: string;
  }>;
  lastActivityAt: string;
};

type BadgeDefinition = {
  code: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold";
  atLeastVisits: number;
};

const BADGES: BadgeDefinition[] = [
  {
    code: "first-footprint",
    name: "First Footprint",
    description: "Visited your first offbeat location.",
    icon: "👣",
    tier: "bronze",
    atLeastVisits: 1,
  },
  {
    code: "hidden-gem-hunter",
    name: "Hidden Gem Hunter",
    description: "Collected three offbeat location visits.",
    icon: "💎",
    tier: "silver",
    atLeastVisits: 3,
  },
  {
    code: "bharat-trailblazer",
    name: "Bharat Trailblazer",
    description: "Collected five offbeat location visits.",
    icon: "🧭",
    tier: "gold",
    atLeastVisits: 5,
  },
];

export class SIHStorageUnavailableError extends Error {
  constructor() {
    super("MongoDB is unavailable. Progress was not saved.");
  }
}

function defaultProgress(): PassportProgress {
  return {
    points: 0,
    visitedLocationIds: [],
    badges: [],
    lastActivityAt: new Date().toISOString(),
  };
}

function serializeProgress(progress: ISIHUserProgress): PassportProgress {
  return {
    points: progress.points,
    visitedLocationIds: progress.visitedLocationIds,
    badges: progress.badges.map((badge) => ({
      code: badge.code,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      tier: badge.tier,
      earnedAt: badge.earnedAt.toISOString(),
    })),
    lastActivityAt: progress.lastActivityAt.toISOString(),
  };
}

function assertMongoUserId(userId: string) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("A MongoDB-backed user session is required for the digital passport.");
  }
}

async function requireDatabase() {
  const database = await connectToDatabase();
  if (!database) throw new SIHStorageUnavailableError();
}

export async function getUserProgress(userId: string): Promise<PassportProgress> {
  assertMongoUserId(userId);
  await requireDatabase();
  const progress = await SIH_UserProgress.findOne({ userId }).lean();
  return progress ? serializeProgress(progress) : defaultProgress();
}

export async function recordOffbeatVisit(userId: string, locationId: string) {
  assertMongoUserId(userId);
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(locationId)) {
    throw new Error("Invalid location ID.");
  }

  await requireDatabase();
  const progress = await SIH_UserProgress.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId, points: 0, visitedLocationIds: [], badges: [] } },
    { new: true, upsert: true }
  );

  const isNewVisit = !progress.visitedLocationIds.includes(locationId);
  if (isNewVisit) {
    progress.visitedLocationIds.push(locationId);
    progress.points += 100;
  }

  const currentBadges = new Set(progress.badges.map((badge) => badge.code));
  const newlyEarned = BADGES.filter(
    (badge) =>
      progress.visitedLocationIds.length >= badge.atLeastVisits &&
      !currentBadges.has(badge.code)
  );

  for (const badge of newlyEarned) {
    progress.badges.push({
      code: badge.code,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      tier: badge.tier,
      earnedAt: new Date(),
    });
  }

  progress.lastActivityAt = new Date();
  await progress.save();

  return {
    progress: serializeProgress(progress),
    visitRecorded: isNewVisit,
    newlyEarned: newlyEarned.map((badge) => ({
      code: badge.code,
      name: badge.name,
      icon: badge.icon,
    })),
  };
}
