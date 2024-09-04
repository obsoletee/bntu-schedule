import { Dispatch, SetStateAction, useState } from 'react';

import style from './NavMenu.module.scss';
interface NavMenuProps {
  menuActive: boolean;
  setMenuActive: Dispatch<SetStateAction<boolean>>;
}

export const NavMenu = ({ menuActive, setMenuActive }: NavMenuProps) => {
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
      </div>
    </div>
  );
};
