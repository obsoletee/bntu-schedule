import { Typography } from 'antd';
import { lazy, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { State } from '../../store';
import { updateDateTime } from '../../utils/common';

const MenuDrawer = lazy(() => import('../MenuDrawer'));

import style from './Header.module.scss';

interface currentState {
  currentDate: string;
  studyWeekNumber: number;
}

export const Header = () => {
  const { Text } = Typography;

  const { currentGroup, university } = useSelector(
    (state: State) => state.currentGroup,
  );

  const [currentState, setCurrentState] = useState<currentState>({
    currentDate: '',
    studyWeekNumber: 0,
  });
  const [isMenuActive, setIsMenuActive] = useState(false);
  useEffect(() => {
    const asyncUpdateDate = async () => {
      const { formattedDate, studyWeekNumber } = await updateDateTime(
        university,
        new Date(),
      );
      setCurrentState({
        currentDate: formattedDate,
        studyWeekNumber: studyWeekNumber,
      });
    };

    asyncUpdateDate();
  }, [university]);

  const showDrawer = () => {
    setIsMenuActive(true);
  };

  return (
    <header>
      <div className={style.container}>
        <div className={style.info}>
          <Text style={{ fontSize: '24px' }} strong>
            Гр. {currentGroup}
          </Text>
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
