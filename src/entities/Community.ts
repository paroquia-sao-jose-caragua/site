export type MassScheduleTime = {
  id: string;
  scheduleId: string;
  startTime: string; // "09:00", "19:30"
  endTime: string;
};

export type CommunityMassSchedule = {
  id: string;
  communityId: string;
  title?: string;
  type: "ordinary" | "devotional" | "solemnity";
  orientations?: string;
  isPrecept: boolean;
  recurrenceType: "weekly" | "monthly" | "yearly";
  dayOfWeek?: number;
  dayOfMonth?: number;
  weekOfMonth?: number;
  monthOfYear?: number;
  active: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt?: string;
  times: MassScheduleTime[];
};

export type Community = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  type: "parish_church" | "chapel";
  address: string;
  coverId: string;
  coverUrl: string;
  massSchedules?: CommunityMassSchedule[];
};
