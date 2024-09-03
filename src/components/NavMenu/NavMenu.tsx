import { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import style from './NavMenu.module.scss';

interface NavItem {
  title: string;
  route: string;
}

interface NavMenuProps {
  items: NavItem[];
  menuActive: boolean;
  setMenuActive: Dispatch<SetStateAction<boolean>>;
}

export const NavMenu = ({ menuActive, setMenuActive, items }: NavMenuProps) => {
  const [recentGroups, setRecentGroups] = useState([]);
  return (
    <div menu-active={menuActive.toString()} className={style.menu}>
      <div className={style.content}>
        <div className={style.recent_block}>
          <div className={style.recent_title}>Недавнее:</div>
          {recentGroups.length ? (
            recentGroups.map((item) => (
              <div
                className={style.recent_item}
                onClick={() => {
                  setMenuActive(false);
                }}
              >
                - {item}
              </div>
            ))
          ) : (
            <div
              className={style.recent_item}
              onClick={() => {
                setMenuActive(false);
              }}
            >
              <i>Вы еще ничего не искали.</i>
            </div>
          )}
        </div>
        <ul className={style.list}>
          {items.map((item, index) => (
            <li key={index} className={style.listElement}>
              <NavLink
                onClick={() => {
                  setMenuActive(false);
                }}
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
