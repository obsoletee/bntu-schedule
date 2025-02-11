import { Space, Typography } from 'antd';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { buttons } from './buttons';
import { State } from '../../store';

import style from './Filter.module.scss';
import { changeSubgroup } from '../../store/currentGroupReducer';

export const Filter = () => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const { subgroup } = useSelector((state: State) => state.currentGroup);

  const handleSubgroupChange = useCallback(
    (value: string) => {
      dispatch(changeSubgroup({ subgroup: value }));
    },
    [dispatch],
  );

  return (
    <Space direction="horizontal">
      {buttons.map((button) => (
        <Text
          key={button.text}
          className={style.filter_button}
          underline
          onClick={() => handleSubgroupChange(button.value)}
          type={subgroup === button.value ? `success` : `secondary`}
        >
          {button.text}
        </Text>
      ))}
    </Space>
  );
};
