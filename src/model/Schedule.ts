export interface Subject {
  shortName: string;
  fullName: string;
}

export interface Teacher {
  shortName: string;
  fullName: string;
}

export interface DaySchedule {
  id: number;
  startTime: string;
  endTime: string;
  type: string;
  subject: Subject;
  teacher: Teacher;
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
