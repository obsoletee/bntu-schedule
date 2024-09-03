import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components/Header/Header';

import style from './Home.module.scss';

interface State {
  isTodayActive: boolean;
  isYesterdayActive: boolean;
  isWeekActive: boolean;
  isDayOfWeekActive: boolean;
}

export const Home = () => {
  // const [currentState, setCurrentState] = useState<State>({
  //   isTodayActive: false,
  //   isYesterdayActive: false,
  //   isWeekActive: false,
  //   isDayOfWeekActive: false,
  // });

  const dispatch = useDispatch();
  const groupNumber = useSelector((state: any) => state.groupNumber);

  return (
    <>
      <div className={style.wrapper}>
        <Header />
        {/* <div className={style.schedule_container}>
          <div className={style.schedule_title}>
            Расписание гр. {groupNumber}:
          </div>
          <div className={style.buttons}>
            <div className={style.schedule_button}>Сегодня</div>
            <div className={style.schedule_button}>Завтра</div>
            <div className={style.schedule_button}>Вся неделя</div>
            <div className={style.schedule_button}>Конкретный день</div>
          </div>
        </div> */}
      </div>
    </>
  );
};
