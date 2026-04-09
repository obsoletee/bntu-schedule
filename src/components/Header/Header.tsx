import { Flex, Typography } from 'antd';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'; // добавлен импорт

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
  const location = useLocation(); // получаем объект location от React Router
  const currentPath = location.pathname; // теперь будет корректный путь без #

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
        currentDayLabel: currentDayOfWeek ? currentDayOfWeek.contraction : '',
      });
    };

    asyncUpdateDate();
  }, [university]);

  const showDrawer = () => {
    setIsMenuActive(true);
  };

  return (
    <>
      <div className={style.container}>
        <MenuOutlined style={{ fontSize: '22px' }} onClick={showDrawer} />
        <Flex vertical gap={0}>
          <Text style={{ fontSize: '18px' }} strong>
            {currentPath === FULL_SCHEDULE
              ? `${currentGroup} (Полное)`
              : currentGroup}
          </Text>
          <Text>{`${currentState.currentDayLabel}, ${currentState.currentDate} Нед. ${currentState.studyWeekNumber}`}</Text>
        </Flex>

        {/* <ExclamationCircleOutlined style={{ fontSize: '22px', color: 'red' }} /> */}
        {currentPath === HOME || currentPath === FULL_SCHEDULE ? (
          <Suspense fallback={<></>}>
            <Filter />
          </Suspense>
        ) : (
          <></>
        )}
        <Link to={currentPath === FULL_SCHEDULE ? HOME : FULL_SCHEDULE}>
          <ScheduleOutlined
            style={
              currentPath === FULL_SCHEDULE
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
    </>
  );
};
