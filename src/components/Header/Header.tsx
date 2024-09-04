import { useCallback, useEffect, useState } from 'react';
import { Drawer, Select, Typography } from 'antd';
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
  const { Title, Text } = Typography;
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

  const showDrawer = () => {
    setIsMenuActive(true);
  };

  const onClose = () => {
    setIsMenuActive(false);
  };

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  return (
    <header>
      <div className={style.container}>
        <div className={style.info}>
          <Title level={3}>Расписание БНТУ</Title>
          <Text>Дата: {currentState.currentDate}</Text>
          <Text>Номер недели: {currentState.studyWeekNumber}</Text>
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
        <Drawer
          title="Расписание БНТУ"
          placement={'left'}
          onClose={onClose}
          open={isMenuActive}
        >
          <Title level={3}>Введите номер группы:</Title>
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="label"
            onChange={onChange}
            onSearch={onSearch}
            options={[
              {
                value: 'jack',
                label: 'Jack',
              },
              {
                value: 'lucy',
                label: 'Lucy',
              },
              {
                value: 'tom',
                label: 'Tom',
              },
            ]}
          />
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </div>
    </header>
  );
};
