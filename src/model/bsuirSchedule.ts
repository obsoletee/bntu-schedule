const lessonType = {
  lecture: 'Лекция',
  practice: 'Практика',
  laba: 'Лаба',
};

const teachers = {
  Ponomareva: {
    shortName: 'Пономарева Е.И.',
    fullName: 'Пономарева Екатерина Игоревна',
  },
  Pinchuk: {
    shortName: 'Пинчук Т.Г.',
    fullName: 'Пинчук Татьяна Георгиевна',
  },
  Rusakovich: {
    shortName: 'Русакович А.Н.',
    fullName: 'Русакович Александр Николаевич',
  },
  Artyshevsky: {
    shortName: 'Артюшевский Н.В.',
    fullName: 'Артюшевский Николай Владимирович',
  },
  Storozhev: {
    shortName: 'Сторожев Д.А.',
    fullName: 'Сторожев Дмитрий Алексеевич',
  },
  PetrovichUU: {
    shortName: 'Петрович Ю.Ю.',
    fullName: 'Петрович Юлия Юрьевна',
  },
  Parhimenko: {
    shortName: 'Пархименко В.А.',
    fullName: 'Пархименко Владимир Анатольевич',
  },
  Shevaldisheva: {
    shortName: 'Шевалдышева Е.З.',
    fullName: 'Шевалдышева Елена Зигфридовна',
  },
  Pashkovskaya: {
    shortName: 'Пашковская К.В.',
    fullName: 'Пашковская Ксения Витальевна',
  },
  Tkalich: {
    shortName: 'Ткалич Т.А',
    fullName: 'Ткалич Татьяна Алексеевна',
  },
  Smirnov: {
    shortName: 'Смирнов И.В.',
    fullName: 'Смирнов Игорь Викторович',
  },
  Komlichenko: {
    shortName: 'Комличенко В.Н.',
    fullName: 'Комличенко Виталий Николаевич',
  },
  Nagulevich: {
    shortName: 'Нагулевич Р.С.',
    fullName: 'Нагулевич Рита Станиславовна',
  },
  Nicheporuk: {
    shortName: 'Ничепорук В.В.',
    fullName: 'Ничепорук Валерия Владимировна',
  },
  Primakovich: {
    shortName: 'Примакович Л.В.',
    fullName: 'Примакович Людмила Васильевна',
  },
  Matyas: {
    shortName: 'Матяс О.А.',
    fullName: 'Матяс Ольга Александровна',
  },
  Dobish: {
    shortName: 'Добыш М.А.',
    fullName: 'Добыш Мария Александровна',
  },
};

const subjects = {
  ris: {
    shortName: 'РИС',
    fullName: 'Распределенные информационные системы',
    avatar: '',
  },
  iove: {
    shortName: 'ИОвЭ',
    fullName: 'Исследование операций в экономике',
    avatar: '',
  },
  mrcb: {
    shortName: 'МРЦБ',
    fullName: 'Моделирование рынка ценных бумаг',
    avatar: '',
  },
  stoei: {
    shortName: 'СТОЭИ',
    fullName: 'Современные технологии обработки экономической информации',
    avatar: '',
  },
  simubd: {
    shortName: 'СиМУБД',
    fullName: 'Системы и методы управления базами данных',
    avatar: '',
  },
  iitem: {
    shortName: 'ИиТЭМ',
    fullName: 'Инструменты и технологии электронного маркетинга',
    avatar: '',
  },
  do: {
    shortName: 'ДО',
    fullName: 'Деловое общение',
    avatar: '',
  },
  infsup: {
    shortName: 'ИнфСУП',
    fullName: 'Информационные системы управления предприятием',
    avatar: '',
  },
  buaia: {
    shortName: 'БУАиА',
    fullName: 'Бухгалтерский учет, анализ и аудит',
    avatar: '',
  },
};

export const bsuirSchedule = {
  group172301: {
    monday: [
      {
        id: 1,
        startTime: '14:00',
        endTime: '15:20',
        type: lessonType.laba,
        subject: subjects.ris,
        teacher: teachers.Ponomareva,
        class: '902',
        korpus: '5',
        subgroup: '2',
        week: ['3'],
      },
      {
        id: 2,
        startTime: '14:00',
        endTime: '15:20',
        type: lessonType.laba,
        subject: subjects.ris,
        teacher: teachers.Ponomareva,
        class: '902',
        korpus: '5',
        subgroup: '1',
        week: ['1'],
      },
      {
        id: 3,
        startTime: '15:50',
        endTime: '17:10',
        type: lessonType.lecture,
        subject: subjects.iove,
        teacher: teachers.Pinchuk,
        class: '712',
        korpus: '5',
        subgroup: '0',
        week: ['1', '3'],
      },
      {
        id: 4,
        startTime: '17:25',
        endTime: '18:45',
        type: lessonType.lecture,
        subject: subjects.mrcb,
        teacher: teachers.Pinchuk,
        class: '514',
        korpus: '5',
        subgroup: '0',
        week: ['2', '4'],
      },
      {
        id: 5,
        startTime: '17:25',
        endTime: '18:45',
        type: lessonType.lecture,
        subject: subjects.stoei,
        teacher: teachers.Rusakovich,
        class: '514',
        korpus: '5',
        subgroup: '0',
        week: ['1', '3'],
      },
      {
        id: 6,
        startTime: '19:00',
        endTime: '20:20',
        type: lessonType.lecture,
        subject: subjects.simubd,
        teacher: teachers.Storozhev,
        class: '514',
        korpus: '5',
        subgroup: '0',
        week: ['2', '4'],
      },
    ],
    tuesday: [
      {
        id: 1,
        startTime: '15:50',
        endTime: '17:10',
        type: lessonType.laba,
        subject: subjects.stoei,
        teacher: teachers.PetrovichUU,
        class: '318а',
        korpus: '5',
        subgroup: '1',
        week: ['2'],
      },
      {
        id: 2,
        startTime: '15:50',
        endTime: '17:10',
        type: lessonType.laba,
        subject: subjects.ris,
        teacher: teachers.Ponomareva,
        class: '322б',
        korpus: '5',
        subgroup: '1',
        week: ['3'],
      },
      {
        id: 3,
        startTime: '15:50',
        endTime: '17:10',
        type: lessonType.laba,
        subject: subjects.stoei,
        teacher: teachers.PetrovichUU,
        class: '309',
        korpus: '5',
        subgroup: '2',
        week: ['3'],
      },
      {
        id: 4,
        startTime: '15:50',
        endTime: '17:10',
        type: lessonType.laba,
        subject: subjects.stoei,
        teacher: teachers.PetrovichUU,
        class: '318а',
        korpus: '5',
        subgroup: '2',
        week: ['4'],
      },
      {
        id: 5,
        startTime: '15:50',
        endTime: '17:10',
        type: lessonType.laba,
        subject: subjects.ris,
        teacher: teachers.Ponomareva,
        class: '322б',
        korpus: '5',
        subgroup: '2',
        week: ['1'],
      },
      {
        id: 6,
        startTime: '15:50',
        endTime: '17:10',
        type: lessonType.laba,
        subject: subjects.stoei,
        teacher: teachers.PetrovichUU,
        class: '309',
        korpus: '5',
        subgroup: '1',
        week: ['1'],
      },
      {
        id: 7,
        startTime: '17:25',
        endTime: '18:45',
        type: lessonType.lecture,
        subject: subjects.iitem,
        teacher: teachers.Parhimenko,
        class: '209',
        korpus: '4',
        subgroup: '0',
        week: ['1', '2', '3', '4'],
      },
      {
        id: 8,
        startTime: '19:00',
        endTime: '20:20',
        type: lessonType.practice,
        subject: subjects.do,
        teacher: teachers.Shevaldisheva,
        class: '402',
        korpus: '4',
        subgroup: '2',
        week: ['1', '2', '3', '4'],
      },
      {
        id: 9,
        startTime: '19:00',
        endTime: '20:20',
        type: lessonType.practice,
        subject: subjects.do,
        teacher: teachers.Pashkovskaya,
        class: '400',
        korpus: '4',
        subgroup: '1',
        week: ['1', '2', '3', '4'],
      },
      {
        id: 10,
        startTime: '20:40',
        endTime: '22:00',
        type: lessonType.lecture,
        subject: subjects.infsup,
        teacher: teachers.Tkalich,
        class: '214',
        korpus: '4',
        subgroup: '0',
        week: ['2', '4'],
      },
      {
        id: 11,
        startTime: '20:20',
        endTime: '22:40',
        type: lessonType.practice,
        subject: subjects.do,
        teacher: teachers.Pashkovskaya,
        class: '402',
        korpus: '4',
        subgroup: '2',
        week: ['1', '3'],
      },
      {
        id: 12,
        startTime: '20:20',
        endTime: '22:00',
        type: lessonType.practice,
        subject: subjects.do,
        teacher: teachers.Pashkovskaya,
        class: '400',
        korpus: '4',
        subgroup: '1',
        week: ['1', '3'],
      },
    ],
    wednesday: [
      {
        id: 1,
        startTime: '12:25',
        endTime: '13:45',
        type: lessonType.lecture,
        subject: subjects.buaia,
        teacher: teachers.Smirnov,
        class: '712',
        korpus: '5',
        subgroup: '0',
        week: ['1', '2', '3'],
      },
      {
        id: 2,
        startTime: '12:25',
        endTime: '13:45',
        type: lessonType.lecture,
        subject: subjects.ris,
        teacher: teachers.Komlichenko,
        class: '712',
        korpus: '5',
        subgroup: '0',
        week: ['4'],
      },
      {
        id: 3,
        startTime: '14:00',
        endTime: '15:20',
        type: lessonType.lecture,
        subject: subjects.ris,
        teacher: teachers.Komlichenko,
        class: '712',
        korpus: '5',
        subgroup: '0',
        week: ['1', '2', '4'],
      },
      {
        id: 4,
        startTime: '14:00',
        endTime: '15:20',
        type: lessonType.lecture,
        subject: subjects.iove,
        teacher: teachers.Pinchuk,
        class: '712',
        korpus: '5',
        subgroup: '0',
        week: ['3'],
      },
      {
        id: 5,
        startTime: '15:50',
        endTime: '17:10',
        type: lessonType.practice,
        subject: subjects.infsup,
        teacher: teachers.PetrovichUU,
        class: '410а',
        korpus: '4',
        subgroup: '0',
        week: ['2'],
      },
      {
        id: 6,
        startTime: '15:50',
        endTime: '17:10',
        type: lessonType.practice,
        subject: subjects.infsup,
        teacher: teachers.PetrovichUU,
        class: '902',
        korpus: '5',
        subgroup: '0',
        week: ['1', '3'],
      },
      {
        id: 7,
        startTime: '15:50',
        endTime: '17:10',
        type: lessonType.practice,
        subject: subjects.do,
        teacher: teachers.Pashkovskaya,
        class: '417',
        korpus: '4',
        subgroup: '1',
        week: ['4'],
      },
      {
        id: 8,
        startTime: '17:25',
        endTime: '18:45',
        type: lessonType.practice,
        subject: subjects.mrcb,
        teacher: teachers.Nagulevich,
        class: '514',
        korpus: '4',
        subgroup: '0',
        week: ['2'],
      },
      {
        id: 9,
        startTime: '17:25',
        endTime: '18:45',
        type: lessonType.laba,
        subject: subjects.ris,
        teacher: teachers.Ponomareva,
        class: '514',
        korpus: '4',
        subgroup: '2',
        week: ['3'],
      },
      {
        id: 10,
        startTime: '17:25',
        endTime: '18:45',
        type: lessonType.practice,
        subject: subjects.do,
        teacher: teachers.Pashkovskaya,
        class: '409',
        korpus: '5',
        subgroup: '1',
        week: ['4'],
      },
      {
        id: 11,
        startTime: '17:25',
        endTime: '18:45',
        type: lessonType.laba,
        subject: subjects.ris,
        teacher: teachers.Ponomareva,
        class: '514',
        korpus: '4',
        subgroup: '1',
        week: ['1'],
      },
    ],
    thursday: [
      {
        id: 1,
        startTime: '10:35',
        endTime: '11:55',
        type: lessonType.laba,
        subject: subjects.stoei,
        teacher: teachers.PetrovichUU,
        class: '318',
        korpus: '4',
        subgroup: '0',
        week: ['2'],
      },
      {
        id: 2,
        startTime: '12:25',
        endTime: '13:45',
        type: lessonType.laba,
        subject: subjects.ris,
        teacher: teachers.Ponomareva,
        class: '322б',
        korpus: '5',
        subgroup: '0',
        week: ['2', '4'],
      },
      {
        id: 3,
        startTime: '14:00',
        endTime: '15:20',
        type: lessonType.practice,
        subject: subjects.iove,
        teacher: teachers.Nicheporuk,
        class: '417',
        korpus: '4',
        subgroup: '0',
        week: ['2', '4'],
      },
      {
        id: 4,
        startTime: '15:50',
        endTime: '17:10',
        type: lessonType.practice,
        subject: subjects.iove,
        teacher: teachers.Nicheporuk,
        class: '417',
        korpus: '4',
        subgroup: '0',
        week: ['2', '4'],
      },
    ],
    friday: [
      {
        id: 1,
        startTime: '12:25',
        endTime: '13:45',
        type: lessonType.practice,
        subject: subjects.do,
        teacher: teachers.Shevaldisheva,
        class: '413',
        korpus: '4',
        subgroup: '2',
        week: ['4'],
      },
      {
        id: 2,
        startTime: '14:00',
        endTime: '15:20',
        type: lessonType.practice,
        subject: subjects.do,
        teacher: teachers.Shevaldisheva,
        class: '413',
        korpus: '4',
        subgroup: '2',
        week: ['4'],
      },
    ],
    saturday: [
      {
        id: 1,
        startTime: '09:00',
        endTime: '10:20',
        type: lessonType.laba,
        subject: subjects.simubd,
        teacher: teachers.Primakovich,
        class: '310к',
        korpus: '4',
        subgroup: '1',
        week: ['2'],
      },
      {
        id: 2,
        startTime: '09:00',
        endTime: '10:20',
        type: lessonType.laba,
        subject: subjects.simubd,
        teacher: teachers.Primakovich,
        class: '310а',
        korpus: '4',
        subgroup: '2',
        week: ['4'],
      },
      {
        id: 3,
        startTime: '10:35',
        endTime: '11:55',
        type: lessonType.laba,
        subject: subjects.buaia,
        teacher: teachers.Matyas,
        class: '221',
        korpus: '5',
        subgroup: '1',
        week: ['2'],
      },
      {
        id: 4,
        startTime: '10:35',
        endTime: '11:55',
        type: lessonType.laba,
        subject: subjects.simubd,
        teacher: teachers.Primakovich,
        class: '310а',
        korpus: '4',
        subgroup: '2',
        week: ['2'],
      },
      {
        id: 5,
        startTime: '10:35',
        endTime: '11:55',
        type: lessonType.laba,
        subject: subjects.buaia,
        teacher: teachers.Matyas,
        class: '414',
        korpus: '4',
        subgroup: '0',
        week: ['3'],
      },
      {
        id: 6,
        startTime: '10:35',
        endTime: '11:55',
        type: lessonType.laba,
        subject: subjects.buaia,
        teacher: teachers.Matyas,
        class: '514',
        korpus: '4',
        subgroup: '2',
        week: ['4'],
      },
      {
        id: 7,
        startTime: '10:35',
        endTime: '11:55',
        type: lessonType.laba,
        subject: subjects.simubd,
        teacher: teachers.Primakovich,
        class: '310а',
        korpus: '4',
        subgroup: '1',
        week: ['4'],
      },
      {
        id: 8,
        startTime: '12:25',
        endTime: '13:45',
        type: lessonType.practice,
        subject: subjects.mrcb,
        teacher: teachers.Nagulevich,
        class: '310а',
        korpus: '4',
        subgroup: '0',
        week: ['2'],
      },
      {
        id: 9,
        startTime: '12:25',
        endTime: '13:45',
        type: lessonType.lecture,
        subject: subjects.iove,
        teacher: teachers.Pinchuk,
        class: '712',
        korpus: '5',
        subgroup: '0',
        week: ['1', '3'],
      },
      {
        id: 10,
        startTime: '12:25',
        endTime: '13:45',
        type: lessonType.laba,
        subject: subjects.simubd,
        teacher: teachers.Primakovich,
        class: '310а',
        korpus: '4',
        subgroup: '0',
        week: ['4'],
      },
      {
        id: 11,
        startTime: '14:00',
        endTime: '15:20',
        type: lessonType.practice,
        subject: subjects.iitem,
        teacher: teachers.Dobish,
        class: '901',
        korpus: '5',
        subgroup: '0',
        week: ['2', '4'],
      },
      {
        id: 12,
        startTime: '14:00',
        endTime: '15:20',
        type: lessonType.lecture,
        subject: subjects.mrcb,
        teacher: teachers.Pinchuk,
        class: '209',
        korpus: '4',
        subgroup: '0',
        week: ['3'],
      },
      {
        id: 11,
        startTime: '14:00',
        endTime: '15:20',
        type: lessonType.lecture,
        subject: subjects.iove,
        teacher: teachers.Pinchuk,
        class: '712',
        korpus: '5',
        subgroup: '0',
        week: ['1'],
      },
    ],
    sunday: [],
  },
};
