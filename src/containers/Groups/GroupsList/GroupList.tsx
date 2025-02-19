import {
  ConfigProvider,
  Input,
  List,
  Space,
  Typography,
  Image,
  Flex,
} from 'antd';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useSelector } from 'react-redux';

import { CustomSpin } from '../../../components/CustomSpin/CustomSpin';

import { State } from '../../../store';
import { useViewportSize } from '../../../hooks/useViewportSize';
import Worker from '../../../webworkers/availableGroupsWorker?worker';

import style from './GroupList.module.scss';

import { icons } from '../../../assets/icons';

export const GroupList = () => {
  const { Text } = Typography;
  const { Search } = Input;
  const { width } = useViewportSize();

  const [searchQuery, setSearchQuery] = useState('');

  const [isPending, startTransition] = useTransition();

  const worker = useMemo(() => {
    return new Worker();
  }, []);

  const { availableGroups } = useSelector(
    (state: State) => state.availableGroups,
  );
  const [filteredGroups, setFiltererdGroups] = useState(availableGroups);

  useEffect(() => {
    if (!searchQuery) {
      setFiltererdGroups(availableGroups);
      return;
    }

    worker.postMessage({ groups: availableGroups, query: searchQuery });

    worker.onmessage = (event) => {
      startTransition(() => {
        setFiltererdGroups(event.data);
      });
    };
  }, [searchQuery, worker, availableGroups]);

  return (
    <ConfigProvider
      theme={{
        components: {
          List: {
            itemPaddingLG: width < 768 ? '16px 8px' : '16px 24px',
          },
        },
      }}
    >
      <Search
        placeholder="Поиск"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={style.search_input}
      />

      {isPending ? (
        <CustomSpin />
      ) : (
        <List
          pagination={{
            position: 'bottom',
            align: 'center',
          }}
          size="large"
          itemLayout="horizontal"
          dataSource={filteredGroups}
          renderItem={(group) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Image
                    style={{ cursor: 'pointer' }}
                    onClick={() => {}}
                    src={
                      group.data.universityCode === 'bntu'
                        ? icons.bntuLogo
                        : icons.bsuirLogo
                    }
                    width={40}
                    height={40}
                    preview={false}
                  />
                }
                title={
                  <Flex
                    justify="space-between"
                    align="center"
                    onClick={() => {}}
                  >
                    <Text strong underline style={{ cursor: 'pointer' }}>
                      {group.data.groupNumber}
                    </Text>
                  </Flex>
                }
                description={
                  <Space style={{ cursor: 'pointer' }} onClick={() => {}}>
                    <Text>{group.data.universityName}</Text>
                    <Text>|</Text>
                    <Text>{group.data.departmentShortName}</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </ConfigProvider>
  );
};
