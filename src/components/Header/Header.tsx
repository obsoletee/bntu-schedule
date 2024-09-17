import { useEffect, useState } from 'react';
import { Typography } from 'antd';

import style from './Header.module.scss';
import { updateDateTime } from '../../utils/common';
import { MenuDrawer } from '../Drawer';
import { State } from '../../store';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HOME } from '../../routes';

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
