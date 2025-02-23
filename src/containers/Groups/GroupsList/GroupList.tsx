import {
  ConfigProvider,
  Input,
  List,
  Space,
  Typography,
  Image,
  Flex,
  message,
} from 'antd';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { useSelector } from 'react-redux';

import { CustomSpin } from '../../../components/CustomSpin/CustomSpin';

import { State } from '../../../store';
import { useViewportSize } from '../../../hooks/useViewportSize';
import Worker from '../../../webworkers/availableGroupsWorker?worker';

import style from './GroupList.module.scss';

import { icons } from '../../../assets/icons';
import { useDispatch } from 'react-redux';
import { setScheduleLoading } from '../../../store/scheduleReducer';
import { changeGroupNumber } from '../../../store/currentGroupReducer';
import { addLatestGroup } from '../../../store/latestGroupsReducer';
import { changeActiveDayOfWeek } from '../../../store/activeDayOfWeekReducer';
import { useNavigate } from 'react-router-dom';
import { HOME } from '../../../routes';

export const GroupList = () => {
  const { Text } = Typography;
  const { Search } = Input;
  const { width } = useViewportSize();

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  const [isPending, startTransition] = useTransition();

  const { latestGroups } = useSelector((state: State) => state.latestGroups);

  const worker = useMemo(() => {
    return new Worker();
  }, []);

  const { availableGroups } = useSelector(
    (state: State) => state.availableGroups,
  );
  const [filteredGroups, setFiltererdGroups] = useState(availableGroups);

  useEffect(() => {
    if (!searchQuery) {
      setFiltererdGroups(
        availableGroups.filter(
          (group) =>
            !latestGroups.some(
              (latest) => latest.groupNumber === group.data.groupNumber,
            ),
        ),
      );
      return;
    }

    worker.postMessage({
      groups: availableGroups.filter(
        (group) =>
          !latestGroups.some(
            (latest) => latest.groupNumber === group.data.groupNumber,
          ),
      ),
      query: searchQuery,
    });

    worker.onmessage = (event) => {
      startTransition(() => {
        setFiltererdGroups(event.data);
      });
    };
  }, [searchQuery, worker, availableGroups, latestGroups]);

  const handleChangeGroupNumber = useCallback(
    (value: string, university: string) => {
      dispatch(setScheduleLoading(true));
      dispatch(
        changeGroupNumber({ currentGroup: value, university: university }),
      );

      dispatch(addLatestGroup({ groupNumber: value }));

      dispatch(changeActiveDayOfWeek('1'));

      dispatch(setScheduleLoading(false));
      messageApi.open({
        type: 'success',
        content: 'Расписание успешно добавлено',
      });
    },
    [dispatch, messageApi],
  );

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
      {contextHolder}
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
            <List.Item
              onClick={() => {
                handleChangeGroupNumber(group.value, group.data.universityCode);
                navigate(HOME);
              }}
            >
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
