import {
  Avatar,
  List,
  Space,
  Typography,
  Image,
  Input,
  Popconfirm,
  ConfigProvider,
} from 'antd';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import {
  ChangeEvent,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { useDispatch } from 'react-redux';
import {
  teacherImages,
} from '../../../assets/images/teacherImages';
import { CustomSpin } from '../../../components/CustomSpin/CustomSpin';
import { State } from '../../../store';
import { setCurrentTeacher } from '../../../store/currentTeacherReducer';
import { useSelector } from 'react-redux';
import { useViewportSize } from '../../../hooks/useViewportSize';
import Worker from '../../../webworkers/teacherSearchWorker?worker';
import { API } from '../../../model/apiConst';

const EditItemModal = lazy(() => import('../../../components/EditItemModal'));

import style from './TeacherList.module.scss';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Teacher } from '../../../model/Schedule';

interface TeacherListProps {
  handleDeleteTeacher: (id: string) => Promise<void>;
}

export const TeacherList = ({ handleDeleteTeacher }: TeacherListProps) => {
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
      setFilteredTeachers(
        [...teacherList].sort((a, b) => a.fullName.localeCompare(b.fullName)),
      );
      return;
    }

    worker.postMessage({ teachers: teacherList, query: searchQuery });

    worker.onmessage = (event) => {
      startTransition(() => {
        setFilteredTeachers(
          event.data.sort((a: Teacher, b: Teacher) =>
            a.fullName.localeCompare(b.fullName),
          ),
        );
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
                        size={64}
                        src={`${API.url}/teachers/${item._id}/avatar`}
                        fallback={teacherImages.emptyAvatar}
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
                        <Popconfirm
                          title="Удалить преподавателя"
                          description="Вы уверены, что хотите удалить этого преподавателя?"
                          icon={
                            <QuestionCircleOutlined style={{ color: 'red' }} />
                          }
                          onConfirm={() => {
                            handleDeleteTeacher(item._id);
                          }}
                          okText="Да"
                          cancelText="Нет"
                        >
                          <DeleteOutlined
                            className={style.binIcon}
                            alt="delete"
                          />
                        </Popconfirm>
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
