import { useDispatch, useSelector } from 'react-redux';
import { State } from '../store';
import { useCallback, useEffect } from 'react';
import {
  getScheduleFromCache,
  setSchedule,
  setScheduleLoading,
} from '../store/scheduleReducer';
import { API } from '../model/apiConst';

export const useScheduleLoader = (university: string, currentGroup: string) => {
  const dispatch = useDispatch();
  const scheduleCache = useSelector((state: State) => state.schedule.cache);

  const fetchData = useCallback(async () => {
    if (scheduleCache[currentGroup]) {
      dispatch(getScheduleFromCache(currentGroup));
      return;
    }

    dispatch(setScheduleLoading(true));
    try {
      const response = await fetch(
        `${API.url}/${university}/group${currentGroup}`,
      );

      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }
      const result = await response.json();
      dispatch(setSchedule({ group: currentGroup, data: result }));
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      dispatch(setScheduleLoading(false));
    }
  }, [university, currentGroup, scheduleCache, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
};
