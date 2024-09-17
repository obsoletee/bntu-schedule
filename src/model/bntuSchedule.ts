import { bntuTeachersImages } from '../assets/images/bntuTeachers';

const lessonType = {
  lecture: 'Лекция',
  practice: 'Практика',
  laba: 'Лаба',
};

const teachers = {
  Empty: {
    shortName: '',
    fullName: '',
    avatar: bntuTeachersImages.empty,
  },
  Pitsuha: {
    shortName: 'Пицуха Е.А.',
    fullName: 'Пицуха Евгений Александрович',
    avatar: bntuTeachersImages.pitsuha,
  },
  Krutilin: {
    shortName: 'Крутилин А.Б.',
    fullName: 'Крутилин Антон Борисович',
    avatar: bntuTeachersImages.empty,
  },
  Nekalo: {
    shortName: 'Некало И.А.',
    fullName: 'Некало Игорь Андреевич',
    avatar: bntuTeachersImages.empty,
  },
  Svistun: {
    shortName: 'Свистун А.Л.',
    fullName: 'Свистун Анастасия Леонидовна',
    avatar: bntuTeachersImages.svistun,
  },
  Brakovich: {
    shortName: 'Бракович И.С.',
    fullName: 'Бракович Игорь Сергеевич',
    avatar: bntuTeachersImages.brakovich,
  },
  Dyachek: {
    shortName: 'Дячек П.И',
    fullName: 'Дячек Петр Иванович',
    avatar: bntuTeachersImages.dyachek,
  },
  Livansky: {
    shortName: 'Ливанский Д.Г.',
    fullName: 'Ливанский Дмитрий Геннадьевич',
    avatar: bntuTeachersImages.empty,
  },
  Polyakova: {
    shortName: 'Полякова О.Е.',
    fullName: 'Полякова Ольга Евгеньевна',
    avatar: bntuTeachersImages.polyakova,
  },
  Strytsky: {
    shortName: 'Струцкий Н.В',
    fullName: 'Струцкий Николай В.',
    avatar: bntuTeachersImages.empty,
  },
  Volohovich: {
    shortName: 'Волохович Д.А.',
    fullName: 'Волохович Д.А.',
    avatar: bntuTeachersImages.empty,
  },
  Karnytsky: {
    shortName: 'Карницкий Н.Б.',
    fullName: 'Карницкий Николай Борисович',
    avatar: bntuTeachersImages.empty,
  },
  Nemkevich: {
    shortName: 'Немкевич Е.Г.',
    fullName: 'Немкевич Елена Геннадьевна',
    avatar: bntuTeachersImages.nemkevich,
  },
};

const subjects = {
  infchas: {
    shortName: 'Инф. час',
    fullName: 'Информационный / Кураторский час',
  },
  ouis: {
    shortName: 'ОУИС',
    fullName: 'Основы управления интеллектуальной собственностью',
  },
  stroyteplfiz: {
    shortName: 'Стр. теплофизика',
    fullName: 'Строительная теплофизика',
  },
  teplogenustanovki: {
    shortName: 'Теплоген. установки',
    fullName: 'Теплогенерирующие установки',
  },
  teplomasobmen: {
    shortName: 'Тепломассообмен',
    fullName: 'Тепломассообмен',
  },
  engecology: {
    shortName: 'Инж. экология',
    fullName: 'Инженерная экология',
  },
  nvik: {
    shortName: 'НВиК',
    fullName: 'Насосы, вентиляторы и компрессоры',
  },
  otoplenie: {
    shortName: 'Отопление',
    fullName: 'Отопление',
  },
  vodosnabjenie: {
    shortName: 'Водоснабжение',
    fullName: 'Водоснабжение и водоотведение',
  },
  fizra: {
    shortName: 'Физра',
    fullName: 'Физическая культура',
  },
};

export const bntuSchedule = {
  group11004122: {
    monday: [
      {
        id: 1,
        startTime: '8:00',
        endTime: '9:35',
        type: lessonType.practice,
        subject: subjects.engecology,
        teacher: teachers.Brakovich,
        class: '410',
        korpus: '11А',
        subgroup: '0',
        week: ['1', '2'],
      },
      {
        id: 2,
        startTime: '9:55',
        endTime: '10:30',
        type: lessonType.lecture,
        subject: subjects.teplogenustanovki,
        teacher: teachers.Pitsuha,
        class: '3П',
        korpus: '8',
        subgroup: '0',
        week: ['1', '2'],
      },
      {
        id: 3,
        startTime: '10:40',
        endTime: '13:15',
        type: lessonType.practice,
        subject: subjects.infchas,
        teacher: teachers.Empty,
        class: '21',
        korpus: '1',
        subgroup: '0',
        week: ['1'],
      },
      {
        id: 4,
        startTime: '13:55',
        endTime: '15:30',
        type: lessonType.practice,
        subject: subjects.ouis,
        teacher: teachers.Nemkevich,
        class: '24',
        korpus: '1',
        subgroup: '0',
        week: ['1'],
      },
    ],
    tuesday: [
      {
        id: 1,
        startTime: '8:00',
        endTime: '9:35',
        type: lessonType.lecture,
        subject: subjects.stroyteplfiz,
        teacher: teachers.Krutilin,
        class: '339',
        korpus: '1',
        subgroup: '0',
        week: ['1'],
      },
      {
        id: 2,
        startTime: '8:00',
        endTime: '9:35',
        type: lessonType.lecture,
        subject: subjects.otoplenie,
        teacher: teachers.Livansky,
        class: '339',
        korpus: '1',
        subgroup: '0',
        week: ['2'],
      },
      {
        id: 3,
        startTime: '9:55',
        endTime: '10:30',
        type: lessonType.laba,
        subject: subjects.teplogenustanovki,
        teacher: teachers.Nekalo,
        class: '322',
        korpus: '2',
        subgroup: '2',
        week: ['1'],
      },
      {
        id: 4,
        startTime: '9:55',
        endTime: '10:30',
        type: lessonType.laba,
        subject: subjects.teplogenustanovki,
        teacher: teachers.Nekalo,
        class: '322',
        korpus: '2',
        subgroup: '1',
        week: ['2'],
      },
      {
        id: 5,
        startTime: '9:55',
        endTime: '10:30',
        type: lessonType.laba,
        subject: subjects.teplomasobmen,
        teacher: teachers.Svistun,
        class: '14',
        korpus: '1',
        subgroup: '1',
        week: ['1'],
      },
      {
        id: 6,
        startTime: '9:55',
        endTime: '10:30',
        type: lessonType.laba,
        subject: subjects.teplomasobmen,
        teacher: teachers.Svistun,
        class: '14',
        korpus: '1',
        subgroup: '2',
        week: ['2'],
      },
      {
        id: 7,
        startTime: '10:40',
        endTime: '13:15',
        type: lessonType.practice,
        subject: subjects.infchas,
        teacher: teachers.Empty,
        class: '362',
        korpus: '1',
        subgroup: '0',
        week: ['2'],
      },
      {
        id: 8,
        startTime: '13:55',
        endTime: '15:30',
        type: lessonType.practice,
        subject: subjects.ouis,
        teacher: teachers.Nemkevich,
        class: '339',
        korpus: '1',
        subgroup: '0',
        week: ['2'],
      },
    ],
    wednesday: [
      {
        id: 1,
        startTime: '8:00',
        endTime: '9:35',
        type: lessonType.practice,
        subject: subjects.teplomasobmen,
        teacher: teachers.Svistun,
        class: '21',
        korpus: '1',
        subgroup: '0',
        week: ['2'],
      },
      {
        id: 2,
        startTime: '9:55',
        endTime: '10:30',
        type: lessonType.laba,
        subject: subjects.stroyteplfiz,
        teacher: teachers.Krutilin,
        class: '14',
        korpus: '1',
        subgroup: '1',
        week: ['1'],
      },
      {
        id: 3,
        startTime: '9:55',
        endTime: '10:30',
        type: lessonType.laba,
        subject: subjects.stroyteplfiz,
        teacher: teachers.Krutilin,
        class: '14',
        korpus: '1',
        subgroup: '1',
        week: ['2'],
      },
      {
        id: 4,
        startTime: '9:55',
        endTime: '10:30',
        type: lessonType.laba,
        subject: subjects.nvik,
        teacher: teachers.Dyachek,
        class: '21',
        korpus: '1',
        subgroup: '2',
        week: ['2'],
      },
      {
        id: 5,
        startTime: '9:55',
        endTime: '10:30',
        type: lessonType.laba,
        subject: subjects.nvik,
        teacher: teachers.Dyachek,
        class: '21',
        korpus: '1',
        subgroup: '2',
        week: ['1'],
      },
      {
        id: 6,
        startTime: '10:40',
        endTime: '13:15',
        type: lessonType.practice,
        subject: subjects.teplogenustanovki,
        teacher: teachers.Karnytsky,
        class: '322',
        korpus: '2',
        subgroup: '0',
        week: ['2'],
      },
      {
        id: 7,
        startTime: '13:55',
        endTime: '15:30',
        type: lessonType.practice,
        subject: subjects.stroyteplfiz,
        teacher: teachers.Krutilin,
        class: '312',
        korpus: '9',
        subgroup: '0',
        week: ['2'],
      },
    ],
    thursday: [
      {
        id: 1,
        startTime: '8:00',
        endTime: '9:35',
        type: lessonType.lecture,
        subject: subjects.otoplenie,
        teacher: teachers.Livansky,
        class: '447',
        korpus: '1',
        subgroup: '0',
        week: ['1', '2'],
      },
      {
        id: 2,
        startTime: '9:55',
        endTime: '10:30',
        type: lessonType.practice,
        subject: subjects.fizra,
        teacher: teachers.Empty,
        class: '',
        korpus: '',
        subgroup: '0',
        week: ['1', '2'],
      },
      {
        id: 3,
        startTime: '10:40',
        endTime: '13:15',
        type: lessonType.lecture,
        subject: subjects.stroyteplfiz,
        teacher: teachers.Krutilin,
        class: '4П',
        korpus: '8',
        subgroup: '0',
        week: ['1', '2'],
      },
      {
        id: 4,
        startTime: '13:55',
        endTime: '15:30',
        type: lessonType.lecture,
        subject: subjects.nvik,
        teacher: teachers.Dyachek,
        class: '5П',
        korpus: '8',
        subgroup: '0',
        week: ['1', '2'],
      },
    ],
    friday: [
      {
        id: 1,
        startTime: '8:00',
        endTime: '9:35',
        type: lessonType.lecture,
        subject: subjects.vodosnabjenie,
        teacher: teachers.Polyakova,
        class: '419',
        korpus: '1',
        subgroup: '0',
        week: ['1', '2'],
      },
      {
        id: 2,
        startTime: '9:55',
        endTime: '10:30',
        type: lessonType.practice,
        subject: subjects.vodosnabjenie,
        teacher: teachers.Polyakova,
        class: '14',
        korpus: '1',
        subgroup: '0',
        week: ['1', '2'],
      },
      {
        id: 3,
        startTime: '13:55',
        endTime: '15:30',
        type: lessonType.lecture,
        subject: subjects.engecology,
        teacher: teachers.Brakovich,
        class: '5П',
        korpus: '8',
        subgroup: '0',
        week: ['1', '2'],
      },
      {
        id: 4,
        startTime: '15:40',
        endTime: '17:15',
        type: lessonType.practice,
        subject: subjects.fizra,
        teacher: teachers.Empty,
        class: '',
        korpus: '',
        subgroup: '0',
        week: ['1', '2'],
      },
    ],
    saturday: [
      {
        id: 1,
        startTime: '8:00',
        endTime: '9:35',
        type: lessonType.lecture,
        subject: subjects.teplomasobmen,
        teacher: teachers.Strytsky,
        class: '453',
        korpus: '1',
        subgroup: '0',
        week: ['1', '2'],
      },
      {
        id: 2,
        startTime: '9:55',
        endTime: '10:30',
        type: lessonType.lecture,
        subject: subjects.teplomasobmen,
        teacher: teachers.Strytsky,
        class: '453',
        korpus: '1',
        subgroup: '0',
        week: ['1', '2'],
      },
      {
        id: 3,
        startTime: '10:40',
        endTime: '13:15',
        type: lessonType.practice,
        subject: subjects.otoplenie,
        teacher: teachers.Volohovich,
        class: '21',
        korpus: '1',
        subgroup: '0',
        week: ['1', '2'],
      },
      {
        id: 4,
        startTime: '15:40',
        endTime: '17:15',
        type: lessonType.laba,
        subject: subjects.otoplenie,
        teacher: teachers.Volohovich,
        class: '9',
        korpus: '1',
        subgroup: '1',
        week: ['1'],
      },
      {
        id: 5,
        startTime: '15:40',
        endTime: '17:15',
        type: lessonType.laba,
        subject: subjects.otoplenie,
        teacher: teachers.Volohovich,
        class: '9',
        korpus: '1',
        subgroup: '2',
        week: ['2'],
      },
    ],
    sunday: [],
  },
};
