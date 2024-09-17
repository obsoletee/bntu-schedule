export const updateDateTime = (
  university: string,
  currentDate: Date,
): { formattedDate: string; studyWeekNumber: number } => {
  const formattedDate = formatDate(currentDate);

  const weekNumber = countWeekNumber(currentDate, university);

  return { formattedDate: formattedDate, studyWeekNumber: weekNumber };
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

export const getShortDayOfWeek = (dayOfWeek: string) => {
  const shortDayOfWeekRU =
    dayOfWeek === 'понедельник'
      ? 'Пн'
      : dayOfWeek === 'вторник'
      ? 'Вт'
      : dayOfWeek === 'среда'
      ? 'Ср'
      : dayOfWeek === 'четверг'
      ? 'Чт'
      : dayOfWeek === 'пятница'
      ? 'Пт'
      : dayOfWeek === 'суббота'
      ? 'Сб'
      : dayOfWeek === 'воскресенье'
      ? 'Вс'
      : '';
  return shortDayOfWeekRU;
};

export const formatDate = (date: Date) => {
  const formattedDate = `${
    date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : `${date.getUTCDate()}`
  }.${
    date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : `${date.getMonth() + 1}`
  }.${date.getFullYear()}`;

  return formattedDate;
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
