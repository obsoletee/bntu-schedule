import { useCallback, useEffect, useState } from 'react';

import { NavMenu } from '../NavMenu';
import { useViewportSize } from '../../hooks/useViewportSize';

import style from './Header.module.scss';
import { countWeekNumber } from '../../utils/common';

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

  const updateDateTime = useCallback(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();

    const weekNumber = countWeekNumber(currentDate);
    setCurrentState({
      currentDate: formattedDate,
      studyWeekNumber: weekNumber,
    });
  }, []);

  useEffect(() => {
    updateDateTime();
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuActive(!isMenuActive);
  }, [isMenuActive]);

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
          <NavMenu menuActive={isMenuActive} setMenuActive={setIsMenuActive} />
        </div>
      </header>
    </>
  );
};
