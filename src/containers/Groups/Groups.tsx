import { Skeleton } from 'antd';
import { lazy, Suspense, useEffect, useState } from 'react';

const AddItemModal = lazy(() => import('../../components/AddItemModal'));
const Header = lazy(() => import('../../components/Header'));
const GroupList = lazy(() => import('./GroupsList'));

import style from './Groups.module.scss';
import { useDispatch } from 'react-redux';
import {
  AllowedGroups,
  setGroups,
  setGroupsLoading,
} from '../../store/availableGroupsReducer';
import { API } from '../../model/apiConst';

export const Groups = () => {
  const dispatch = useDispatch();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setGroupsLoading(true));
      try {
        const response = await fetch(`${API.localhost}/availableGroups`);

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
        const result: AllowedGroups[] = await response.json();
        dispatch(setGroups(result));
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        dispatch(setGroupsLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className={style.wrapper}>
      <Suspense fallback={<Skeleton active />}>
        <Header />
      </Suspense>
      <div className={style.container}>
        <Suspense fallback={<Skeleton active />}>
          <AddItemModal
            isAddItemModalOpen={isAddItemModalOpen}
            setIsAddItemModalOpen={setIsAddItemModalOpen}
          />
        </Suspense>

        <Suspense fallback={<Skeleton active />}>
          <GroupList />
        </Suspense>
      </div>
    </div>
  );
};
