import { Teacher } from '../model/Schedule';

self.onmessage = (event) => {
  const { teachers, query } = event.data;
  const filtered = teachers.filter((teachers: Teacher) =>
    teachers.fullName.toLowerCase().includes(query.toLowerCase()),
  );
  self.postMessage(filtered);
};
