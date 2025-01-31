import {
  Avatar,
  Button,
  ConfigProvider,
  List,
  Popover,
  Space,
  Typography,
  Image,
  Input,
} from 'antd';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import {
  ChangeEvent,
  Dispatch,
  lazy,
  SetStateAction,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { useDispatch } from 'react-redux';

import { CustomSpin } from '../../../components/CustomSpin/CustomSpin';
import {
  TeacherImageKeys,
  teacherImages,
} from '../../../assets/images/teacherImages';
import { State } from '../../../store';
import { setCurrentTeacher } from '../../../store/currentTeacherReducer';
import { useSelector } from 'react-redux';
import { useViewportSize } from '../../../hooks/useViewportSize';
import Worker from '../../../webworkers/teacherSearchWorker?worker';

const EditItemModal = lazy(() => import('../../../components/EditItemModal'));

import style from './TeacherList.module.scss';

interface TeacherListProps {
  handleDeleteTeacher: (id: string) => Promise<void>;
  visiblePopoverId: string | undefined;
  setVisiblePopoverId: Dispatch<SetStateAction<string | undefined>>;
}

export const TeacherList = ({
  handleDeleteTeacher,
  visiblePopoverId,
  setVisiblePopoverId,
}: TeacherListProps) => {
  const dispatch = useDispatch();
  const { Text } = Typography;
  const { Search } = Input;
  const { width } = useViewportSize();

  const { teacherList, isTeachersLoading } = useSelector(
    (state: State) => state.teachers,
  );

  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTeachers, setFilteredTeachers] = useState(teacherList);
  const [isPending, startTransition] = useTransition();

  const worker = useMemo(() => {
    return new Worker();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredTeachers(teacherList);
      return;
    }

    worker.postMessage({ teachers: teacherList, query: searchQuery });

    worker.onmessage = (event) => {
      startTransition(() => {
        setFilteredTeachers(event.data);
      });
    };
  }, [searchQuery, teacherList, worker]);

  return (
    <>
      <Search
        value={searchQuery}
        placeholder="Поиск"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchQuery(e.target.value)
        }
        className={style.search_input}
      />
      <ConfigProvider
        theme={{
          components: {
            List: {
              itemPaddingLG: width < 768 ? '16px 8px' : '16px 24px',
              avatarMarginRight: width < 768 ? '8px' : '16px',
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
            loading={isTeachersLoading}
            grid={
              width > 1024
                ? { column: 4, gutter: 0 }
                : width > 768
                ? { column: 2, gutter: 0 }
                : { column: 1, gutter: 0 }
            }
            itemLayout="horizontal"
            dataSource={filteredTeachers}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={
                        <Image
                          src={
                            teacherImages[item.avatar as TeacherImageKeys] ||
                            teacherImages.emptyAvatar
                          }
                        />
                      }
                    />
                  }
                  title={
                    <Space size={width < 768 ? 'small' : 'large'}>
                      <Text strong>{item.shortName}</Text>
                      <div className={style.icon_container}>
                        <EditOutlined
                          className={style.editIcon}
                          alt="edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setCurrentTeacher(item));
                            setIsEditItemModalOpen(true);
                          }}
                        />
                        <Popover
                          title={
                            'Вы уверены, что хотите удалить этого преподавателя?'
                          }
                          content={
                            <Space>
                              <Button
                                onClick={() => handleDeleteTeacher(item._id)}
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
