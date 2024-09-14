export const countWeekNumber = (
  currentDate: Date,
  university: string,
): number => {
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const pastDaysOfYear =
    (currentDate.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber =
    university === 'bsuir'
      ? (Math.ceil((pastDaysOfYear + startOfYear.getDay()) / 7) % 4) + 2
      : university === 'bntu'
      ? (Math.ceil((pastDaysOfYear + startOfYear.getDay()) / 7) % 2) + 1
      : (Math.ceil((pastDaysOfYear + startOfYear.getDay()) / 7) % 4) + 2;
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
