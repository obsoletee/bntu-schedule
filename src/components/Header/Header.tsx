import { Typography } from 'antd';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { State } from '../../store';
import { updateDateTime } from '../../utils/common';

const MenuDrawer = lazy(() => import('../MenuDrawer'));
const Filter = lazy(() => import('../../components/Filter'));

import style from './Header.module.scss';
import { MenuOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { FULL_SCHEDULE, HOME } from '../../routes/';

interface currentState {
  currentDate: string;
  studyWeekNumber: number;
  currentDayLabel: string;
}

export const Header = () => {
  const { Text } = Typography;

  const { currentGroup, university } = useSelector(
    (state: State) => state.currentGroup,
  );

  const [currentState, setCurrentState] = useState<currentState>({
    currentDate: '',
    studyWeekNumber: 0,
    currentDayLabel: '',
  });
  const [isMenuActive, setIsMenuActive] = useState(false);
  useEffect(() => {
    const asyncUpdateDate = () => {
      const {
        formattedDate,
        studyWeekNumber,
        currentDayOfWeek,
      } = updateDateTime(university, new Date());
      setCurrentState({
        currentDate: formattedDate,
        studyWeekNumber: studyWeekNumber,
        currentDayLabel: currentDayOfWeek.contraction,
      });
    };

    asyncUpdateDate();
  }, [university]);

  const currentPath = useMemo(() => {
    return window.location.pathname;
  }, []);

  const showDrawer = () => {
    setIsMenuActive(true);
  };

  return (
    <header>
      <div className={style.container}>
        <MenuOutlined style={{ fontSize: '22px' }} onClick={showDrawer} />
        <div className={style.info}>
          <Text style={{ fontSize: '18px' }} strong>
            {currentPath === '/schedule'
              ? `${currentGroup} (Полное)`
              : currentGroup}
          </Text>
          <Text>{`${currentState.currentDayLabel}, ${currentState.currentDate} Нед. ${currentState.studyWeekNumber}`}</Text>
        </div>

        {/* <ExclamationCircleOutlined style={{ fontSize: '22px', color: 'red' }} /> */}
        <Suspense fallback={<></>}>
          <Filter />
        </Suspense>
        <Link to={currentPath === '/schedule' ? HOME : FULL_SCHEDULE}>
          <ScheduleOutlined
            style={
              currentPath === '/schedule'
                ? { fontSize: '22px', color: 'blue' }
                : { fontSize: '22px', color: 'black' }
            }
          />
        </Link>
      </div>
      <MenuDrawer
        isMenuActive={isMenuActive}
        setIsMenuActive={setIsMenuActive}
      />
    </header>
  );
};
