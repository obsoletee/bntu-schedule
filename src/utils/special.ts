export const deepEqual = (obj1: any, obj2: any): boolean => {
  // Проверка на идентичность
  if (obj1 === obj2) return true;

  // Проверка на тип
  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }

  // Получаем ключи объектов
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Проверка на количество ключей
  if (keys1.length !== keys2.length) return false;

  // Сравниваем ключи и значения
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};
