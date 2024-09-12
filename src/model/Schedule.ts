export interface DaySchedule {
  id: number;
  startTime: string;
  endTime: string;
  type: string;
  shortName: string;
  name: string;
  teacher: string;
  class: string;
  korpus: string;
  subgroup: string;
  week: string[];
}

interface GroupSchedule {
  monday: DaySchedule[];
  tuesday: DaySchedule[];
  wednesday: DaySchedule[];
  thursday: DaySchedule[];
  friday: DaySchedule[];
  saturday: DaySchedule[];
}

export interface Schedule {
  [key: string]: GroupSchedule;
}
