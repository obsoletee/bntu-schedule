import { useCallback, useEffect, useState } from 'react';
import { Drawer, Select, Space, Typography } from 'antd';
import { useViewportSize } from '../../hooks/useViewportSize';

import style from './Header.module.scss';
import { countWeekNumber } from '../../utils/common';
import { bntuAllowedGroups, bsuirAllowedGroups } from '../../model/groups';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();

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

  const changeGroupNumber = (value: string) => {
    dispatch({ type: 'CHANGE_GROUP_NUMBER', payload: value });
    setIsMenuActive(false);
  };
  const showDrawer = () => {
    setIsMenuActive(true);
  };

  const onClose = () => {
    setIsMenuActive(false);
  };

  const onChange = (value: string) => {
    changeGroupNumber(value);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
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
        <Drawer
          title="Расписание"
          placement={'left'}
          onClose={onClose}
          open={isMenuActive}
        >
          <Title level={3}>Выберите группу:</Title>
          <Space direction="vertical">
            <Space direction="horizontal">
              <Text>БНТУ</Text>
              <Select
                showSearch
                placeholder="Номер группы"
                optionFilterProp="label"
                onChange={onChange}
                onSearch={onSearch}
                options={bntuAllowedGroups}
              />
            </Space>
            <Space direction="horizontal">
              <Text>БГУИР</Text>
              <Select
                showSearch
                placeholder="Номер группы"
                optionFilterProp="label"
                onChange={onChange}
                onSearch={onSearch}
                options={bsuirAllowedGroups}
              />
            </Space>
          </Space>
        </Drawer>
      </div>
    </header>
  );
};
