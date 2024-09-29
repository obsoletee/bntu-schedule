import { Space, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { buttons } from './buttons';
import { State } from '../../store';

import style from './Filter.module.scss';

export const Filter = () => {
  const { Text } = Typography;
  const dispatch = useDispatch();
  const groupInfo = useSelector((state: State) => state.currentGroup);

  const handleSubgroupChange = (value: string) => {
    dispatch({
      type: 'CHANGE_SUBGROUP',
      payload: { subgroup: value },
    });
  };

  return (
    <Space direction="horizontal">
      {buttons.map((button) => (
        <Text
          key={button.text}
          className={style.filter_button}
          underline
          onClick={() => handleSubgroupChange(button.value)}
          type={groupInfo.subgroup === button.value ? `success` : `secondary`}
        >
          {button.text}
        </Text>
      ))}
    </Space>
  );
};
