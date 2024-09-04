export const countWeekNumber = (currentDate: Date): number => {
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const pastDaysOfYear =
    (currentDate.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber =
    Math.ceil((pastDaysOfYear + startOfYear.getDay()) / 7) % 2 === 0 ? 1 : 2;
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
