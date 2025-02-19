import { AllowedGroups } from '../store/availableGroupsReducer';

self.onmessage = (event) => {
  const { groups, query } = event.data;
  const filtered = groups.filter((group: AllowedGroups) =>
    group.data.groupNumber.toLowerCase().includes(query.toLowerCase()),
  );
  self.postMessage(filtered);
};
