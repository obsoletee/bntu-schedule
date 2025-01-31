import { Subject } from '../model/Schedule';

self.onmessage = (event) => {
  const { subjects, query } = event.data;
  const filtered = subjects.filter(
    (subject: Subject) =>
      subject.fullName.toLowerCase().includes(query.toLowerCase()) ||
      subject.shortName.toLowerCase().includes(query.toLowerCase()),
  );
  self.postMessage(filtered);
};
