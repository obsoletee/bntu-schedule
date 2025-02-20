import { Teacher } from '../model/Schedule';

self.onmessage = (event) => {
  const { teachers, query } = event.data;

  const filtered = teachers.filter((teacher: Teacher) =>
    teacher.fullName.toLowerCase().includes(query.toLowerCase()),
  );

  self.postMessage(filtered);
};
