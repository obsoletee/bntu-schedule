export interface LessonType {
  label: string;
  value: string;
}

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const lessonTypeList = [
  {
    value: 'Лекция',
    label: 'Лекция',
  },
  {
    value: 'Практика',
    label: 'Практика',
  },
  {
    value: 'Лаба',
    label: 'Лаба',
  },
];

export const daysOfWeek: Array<{
  key: string;
  label: string;
  day: DayOfWeek;
}> = [
  { key: '1', label: 'Понедельник', day: 'monday' },
  { key: '2', label: 'Вторник', day: 'tuesday' },
  { key: '3', label: 'Среда', day: 'wednesday' },
  { key: '4', label: 'Четверг', day: 'thursday' },
  { key: '5', label: 'Пятница', day: 'friday' },
  { key: '6', label: 'Суббота', day: 'saturday' },
  { key: '7', label: 'Воскресенье', day: 'sunday' },
];

export interface Subject {
  shortName: string;
  fullName: string;
}

export interface Teacher {
  shortName: string;
  fullName: string;
  avatar: string;
}

export interface DaySchedule {
  id: string;
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

export interface GroupSchedule {
  _id: string;
  group: string;
  monday: DaySchedule[];
  tuesday: DaySchedule[];
  wednesday: DaySchedule[];
  thursday: DaySchedule[];
  friday: DaySchedule[];
  saturday: DaySchedule[];
  sunday: DaySchedule[];
}
