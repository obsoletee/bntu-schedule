export interface AllowedGroups {
  value: {
    groupNumber: string;
    universityCode: string;
    universityName: string;
    department: string;
  };
  label: string;
}

export const groups: AllowedGroups[] = [
  {
    value: {
      groupNumber: '11004122',
      universityCode: 'bntu',
      universityName: 'БНТУ',
      department: 'ФЭС',
    },
    label: '11004122',
  },
  {
    value: {
      groupNumber: '11004222',
      universityCode: 'bntu',
      universityName: 'БНТУ',
      department: 'ФЭС',
    },
    label: '11004222',
  },
  {
    value: {
      groupNumber: '11004322',
      universityCode: 'bntu',
      universityName: 'БНТУ',
      department: 'ФЭС',
    },
    label: '11004322',
  },
  {
    value: {
      groupNumber: '11102122',
      universityCode: 'bntu',
      universityName: 'БНТУ',
      department: 'АФ',
    },
    label: '11102122',
  },
  {
    value: {
      groupNumber: '172301',
      universityCode: 'bsuir',
      universityName: 'БГУИР',
      department: 'ИЭФ',
    },
    label: '172301',
  },
  {
    value: {
      groupNumber: '172302',
      universityCode: 'bsuir',
      universityName: 'БГУИР',
      department: 'ИЭФ',
    },
    label: '172302',
  },
  {
    value: {
      groupNumber: '172303',
      universityCode: 'bsuir',
      universityName: 'БГУИР',
      department: 'ИЭФ',
    },
    label: '172303',
  },
];

export const bntuAllowedGroups = [
  { value: '11004122', label: '11004122' },
  { value: '11004222', label: '11004222' },
  { value: '11004322', label: '11004322' },
  { value: '11102122', label: '11102122' },
];

export const bsuirAllowedGroups = [
  { value: '172301', label: '172301' },
  { value: '172302', label: '172302' },
  { value: '172303', label: '172303' },
];
