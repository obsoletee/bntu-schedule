import { TeacherImageKeys } from '../assets/images/teacherImages';

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
  contraction: string;
}> = [
  { key: '1', label: 'Понедельник', day: 'monday', contraction: 'Пн' },
  { key: '2', label: 'Вторник', day: 'tuesday', contraction: 'Вт' },
  { key: '3', label: 'Среда', day: 'wednesday', contraction: 'Ср' },
  { key: '4', label: 'Четверг', day: 'thursday', contraction: 'Чт' },
  { key: '5', label: 'Пятница', day: 'friday', contraction: 'Пт' },
  { key: '6', label: 'Суббота', day: 'saturday', contraction: 'Сб' },
  { key: '7', label: 'Воскресенье', day: 'sunday', contraction: 'Вс' },
];

export interface Subject {
  _id: string;
  shortName: string;
  fullName: string;
}

export interface Teacher {
  _id: string;
  shortName: string;
  fullName: string;
  avatar: TeacherImageKeys;
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
