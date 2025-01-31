import {
  Button,
  ConfigProvider,
  Input,
  List,
  Popover,
  Space,
  Typography,
} from 'antd';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import {
  Dispatch,
  lazy,
  SetStateAction,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CustomSpin } from '../../../components/CustomSpin/CustomSpin';
import { setCurrentSubject } from '../../../store/currentSubjectReducer';
import { State } from '../../../store';
import { useViewportSize } from '../../../hooks/useViewportSize';
import Worker from '../../../webworkers/subjectSearchWorker?worker';

const EditItemModal = lazy(() => import('../../../components/EditItemModal'));

import style from './SubjectList.module.scss';

interface SubjectListProps {
  handleDeleteSubject: (id: string) => Promise<void>;
  visiblePopoverId: string | undefined;
  setVisiblePopoverId: Dispatch<SetStateAction<string | undefined>>;
}

export const SubjectList = ({
  handleDeleteSubject,
  visiblePopoverId,
  setVisiblePopoverId,
}: SubjectListProps) => {
  const dispatch = useDispatch();
  const { Text } = Typography;
  const { Search } = Input;
  const { width } = useViewportSize();

  const { subjectList, isSubjectsLoading } = useSelector(
    (state: State) => state.subjects,
  );

  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState(subjectList);
  const [isPending, startTransition] = useTransition();

  const worker = useMemo(() => {
    return new Worker();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredSubjects(subjectList);
      return;
    }

    worker.postMessage({ subjects: subjectList, query: searchQuery });

    worker.onmessage = (event) => {
      startTransition(() => {
        setFilteredSubjects(event.data);
      });
    };
  }, [searchQuery, subjectList, worker]);

  return (
    <>
      <Search
        placeholder="Поиск"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={style.search_input}
      />
      <ConfigProvider
        theme={{
          components: {
            List: {
              itemPaddingLG: width < 768 ? '16px 8px' : '16px 24px',
            },
          },
        }}
      >
        {isPending ? (
          <CustomSpin />
        ) : (
          <List
            pagination={{
              pageSize: 10,
              position: 'bottom',
              align: 'center',
            }}
            size="large"
            loading={isSubjectsLoading}
            grid={
              width > 1024
                ? { column: 4, gutter: 0 }
                : width > 768
                ? { column: 2, gutter: 0 }
                : { column: 1, gutter: 0 }
            }
            itemLayout="horizontal"
            dataSource={filteredSubjects}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space size={'large'}>
                      <Text strong>{item.shortName}</Text>
                      <div className={style.icon_container}>
                        <EditOutlined
                          className={style.editIcon}
                          alt="edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setCurrentSubject(item));
                            setIsEditItemModalOpen(true);
                          }}
                        />
                        <Popover
                          title={'Вы уверены, что хотите удалить этот предмет?'}
                          content={
                            <Space>
                              <Button
                                onClick={() => handleDeleteSubject(item._id)}
                                onMouseDown={(e) => e.preventDefault()}
                              >
                                <Text type="danger">Да</Text>
                              </Button>
                            </Space>
                          }
                          trigger="click"
                          open={visiblePopoverId === item._id}
                          onOpenChange={(visible) => {
                            if (!visible) {
                              setVisiblePopoverId(undefined);
                            }
                          }}
                        >
                          <DeleteOutlined
                            className={style.binIcon}
                            alt="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVisiblePopoverId(
                                visiblePopoverId === item._id
                                  ? undefined
                                  : item._id,
                              );
                            }}
                          />
                        </Popover>
                      </div>
                    </Space>
                  }
                  description={<Text type="secondary">{item.fullName}</Text>}
                />
              </List.Item>
            )}
          />
        )}
      </ConfigProvider>
      <Suspense fallback={<CustomSpin />}>
        <EditItemModal
          isEditItemModalOpen={isEditItemModalOpen}
          setIsEditItemModalOpen={setIsEditItemModalOpen}
        />
      </Suspense>
    </>
  );
};
