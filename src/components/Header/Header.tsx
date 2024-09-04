import { useEffect, useState } from 'react';

import { NavMenu } from '../NavMenu';
import { useViewportSize } from '../../hooks/useViewportSize';

import { navItems } from './data';

import style from './Header.module.scss';

interface State {
  currentDate: string;
  studyWeekNumber: number;
}

export const Header = () => {
  const [currentState, setCurrentState] = useState<State>({
    currentDate: '',
    studyWeekNumber: 0,
  });

  const [isMenuActive, setIsMenuActive] = useState(false);

  const { width } = useViewportSize();

  // Function to update date and week number
  const updateDateTime = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();

    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (currentDate.getTime() - startOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil(
      (pastDaysOfYear + startOfYear.getDay() + 1) / 7,
    );
    const studyWeek = weekNumber % 2 === 0 ? 1 : 2;

    setCurrentState({
      currentDate: formattedDate,
      studyWeekNumber: studyWeek,
    });
  };

  const getTimeUntilMidnight = () => {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0,
    );
    return nextMidnight.getTime() - now.getTime();
  };

  useEffect(() => {
    console.log('Привет');
    updateDateTime();

    const timeUntilMidnight = getTimeUntilMidnight();
    const intervalId = setInterval(() => {
      updateDateTime();
      const newTimeUntilMidnight = getTimeUntilMidnight();
      clearInterval(intervalId);
      setTimeout(() => {
        updateDateTime();
        setInterval(() => {
          updateDateTime();
        }, 24 * 60 * 60 * 1000);
      }, newTimeUntilMidnight);
    }, timeUntilMidnight);

    return () => clearInterval(intervalId);
  }, []);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  return (
    <>
      <header>
        <div className={style.container}>
          <div className={style.logo}>
            <div className={style.info}>
              <span>Расписание БНТУ</span>
            </div>
            <div className={style.date}>Дата: {currentState.currentDate}</div>
            <div className={style.date}>
              Номер недели: {currentState.studyWeekNumber}
            </div>
          </div>
          {width < 768 && (
            <div
              onClick={toggleMenu}
              className={
                isMenuActive ? style.burger_button_active : style.burger_button
              }
            >
              <span />
            </div>
          )}
          <NavMenu
            menuActive={isMenuActive}
            setMenuActive={setIsMenuActive}
            items={navItems}
          />
        </div>
      </header>
    </>
  );
};
