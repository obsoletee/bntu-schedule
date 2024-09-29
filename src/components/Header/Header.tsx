import { Link } from 'react-router-dom';
import { Typography } from 'antd';
import { lazy, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const MenuDrawer = lazy(() => import('../MenuDrawer'));
import { HOME } from '../../routes';
import { State } from '../../store';
import { updateDateTime } from '../../utils/common';

import style from './Header.module.scss';

interface currentState {
  currentDate: string;
  studyWeekNumber: number;
}

export const Header = () => {
  const [currentState, setCurrentState] = useState<currentState>({
    currentDate: '',
    studyWeekNumber: 0,
  });

  const groupInfo = useSelector((state: State) => state.currentGroup);

  const [isMenuActive, setIsMenuActive] = useState(false);
  const { Title, Text } = Typography;

  useEffect(() => {
    const { formattedDate, studyWeekNumber } = updateDateTime(
      groupInfo.university,
      new Date(),
    );
    setCurrentState({
      currentDate: formattedDate,
      studyWeekNumber: studyWeekNumber,
    });
  }, [groupInfo]);

  const showDrawer = () => {
    setIsMenuActive(true);
  };

  return (
    <header>
      <div className={style.container}>
        <div className={style.info}>
          <Title level={3}>
            <Link to={HOME}>Расписание</Link>
          </Title>
          <Text>Сегодня: {currentState.currentDate}</Text>
          <Text>Неделя: {currentState.studyWeekNumber}</Text>
        </div>
        <div
          onClick={showDrawer}
          className={
            isMenuActive ? style.burger_button_active : style.burger_button
          }
        >
          <span />
        </div>
        <MenuDrawer
          isMenuActive={isMenuActive}
          setIsMenuActive={setIsMenuActive}
        />
      </div>
    </header>
  );
};
