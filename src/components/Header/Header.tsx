import { useCallback, useEffect, useState } from 'react';
import { Typography } from 'antd';
import { useViewportSize } from '../../hooks/useViewportSize';

import style from './Header.module.scss';
import { countWeekNumber } from '../../utils/common';
import { MenuDrawer } from '../Drawer';
import { State } from '../../store';
import { useSelector } from 'react-redux';

interface currentState {
  currentDate: string;
  studyWeekNumber: number;
}

export const Header = () => {
  const [currentState, setCurrentState] = useState<currentState>({
    currentDate: '',
    studyWeekNumber: 0,
  });

  const groupNumber = useSelector((state: State) => state.currentGroup);

  const [isMenuActive, setIsMenuActive] = useState(false);
  const { Title, Text } = Typography;
  const { width } = useViewportSize();

  const updateDateTime = useCallback(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();

    const weekNumber = countWeekNumber(currentDate, groupNumber.university);
    setCurrentState({
      currentDate: formattedDate,
      studyWeekNumber: weekNumber,
    });
  }, []);

  useEffect(() => {
    updateDateTime();
  }, [groupNumber]);

  const showDrawer = () => {
    setIsMenuActive(true);
  };

  return (
    <header>
      <div className={style.container}>
        <div className={style.info}>
          <Title level={3}>Расписание</Title>
          <Text>Сегодня: {currentState.currentDate}</Text>
          <Text>Неделя: {currentState.studyWeekNumber}</Text>
        </div>
        {width < 768 && (
          <div
            onClick={showDrawer}
            className={
              isMenuActive ? style.burger_button_active : style.burger_button
            }
          >
            <span />
          </div>
        )}
        <MenuDrawer
          isMenuActive={isMenuActive}
          setIsMenuActive={setIsMenuActive}
        />
      </div>
    </header>
  );
};
