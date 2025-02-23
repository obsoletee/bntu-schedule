import { daysOfWeek } from '../model/Schedule';

export const updateDateTime = (
  university: string,
  currentDate: Date,
): {
  formattedDate: string;
  studyWeekNumber: number;
  currentDayOfWeek: {
    key: string;
    label: string;
    day: string;
    contraction: string;
  };
} => {
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;
  const currentDayOfWeek = daysOfWeek.filter(
    (day) => day.key === currentDate.getDay().toString().toLowerCase(),
  )[0];
  const weekNumber = countWeekNumber(currentDate, university);

  return { formattedDate, studyWeekNumber: weekNumber, currentDayOfWeek };
};

export const countWeekNumber = (
  currentDate: Date,
  university: string,
): number => {
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const pastDaysOfYear =
    (currentDate.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber =
    university === 'bsuir'
      ? calculateBsuirWeekNumber(startOfYear, pastDaysOfYear)
      : university === 'bntu'
      ? calculateBntuWeekNumber(startOfYear, pastDaysOfYear)
      : calculateBsuirWeekNumber(startOfYear, pastDaysOfYear);

  return weekNumber;
};

export const calculateBntuWeekNumber = (
  startOfYear: Date,
  pastDaysOfYear: number,
): number => {
  return (Math.ceil((pastDaysOfYear + startOfYear.getDay() - 1) / 7) % 2) + 1;
};

export const calculateBsuirWeekNumber = (
  startOfYear: Date,
  pastDaysOfYear: number,
): number => {
  switch (Math.ceil((pastDaysOfYear + startOfYear.getDay() - 1) / 7) % 4) {
    case 0:
      return 2;
    case 1:
      return 3;
    case 2:
      return 4;
    case 3:
      return 1;
    default:
      return 0;
  }
};
