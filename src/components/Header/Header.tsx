import classNames from 'classnames';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { NavMenu } from '../NavMenu';
import { useViewportSize } from '../../hooks/useViewportSize';
import { images } from '../../assets/images';

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

  const navigate = useNavigate();
  const { width } = useViewportSize();

  useEffect(() => {
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

    updateDateTime();
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
              <img
                onClick={() => navigate('/')}
                src={images.bntuLogo}
                alt={'logo'}
              />
            </div>
            <div className={style.date}>
              Дата: {currentState.currentDate} | Номер недели:{' '}
              {currentState.studyWeekNumber}
            </div>
          </div>
          {width > 768 && (
            <div className={style.navigation}>
              {navItems.map((item) => (
                <NavLink
                  key={item.route}
                  to={item.route}
                  className={({ isActive }) =>
                    classNames({
                      [style.item]: true,
                      [style.item__active]: isActive,
                    })
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </div>
          )}

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
