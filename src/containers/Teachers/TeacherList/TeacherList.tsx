import {
  Avatar,
  Button,
  ConfigProvider,
  Input,
  List,
  Popover,
  Space,
  Typography,
  Image,
} from 'antd';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';

import {
  TeacherImageKeys,
  teacherImages,
} from '../../../assets/images/teacherImages';
import { State } from '../../../store';
import { useSelector } from 'react-redux';
import { useViewportSize } from '../../../hooks/useViewportSize';

import style from './TeacherList.module.scss';
import { Dispatch, SetStateAction } from 'react';

interface NewTeacher {
  fullName: string;
  shortName: string;
  avatar: string;
}

interface TeacherListProps {
  newTeacher: NewTeacher;
  setNewTeacher: Dispatch<SetStateAction<NewTeacher>>;
  handleEditTeacher: () => Promise<void>;
  setEditingTeacherId: Dispatch<SetStateAction<string | undefined>>;
  handleDeleteTeacher: (id: string) => Promise<void>;
  visiblePopoverId: string | undefined;
  setVisiblePopoverId: Dispatch<SetStateAction<string | undefined>>;
}

export const TeacherList = ({
  newTeacher,
  setNewTeacher,
  handleEditTeacher,
  setEditingTeacherId,
  handleDeleteTeacher,
  visiblePopoverId,
  setVisiblePopoverId,
}: TeacherListProps) => {
  const { Text } = Typography;
  const { width } = useViewportSize();

  const { teacherList, isTeachersLoading } = useSelector(
    (state: State) => state.teachers,
  );

  return (
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
      <List
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
        dataSource={teacherList}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={
                    <Image
                      src={
                        teacherImages[
                          item.avatar.toLowerCase() as TeacherImageKeys
                        ] || teacherImages.emptyAvatar
                      }
                    />
                  }
                />
              }
              title={
                <Space size={width < 768 ? 'small' : 'large'}>
                  <Text strong>{item.shortName}</Text>
                  <div className={style.icon_container}>
                    <Popover
                      title={'Изменение преподавателя'}
                      content={
                        <Space direction="vertical">
                          <Input
                            placeholder="Полное ФИО"
                            value={newTeacher.fullName}
                            onChange={(e) =>
                              setNewTeacher((prev) => ({
                                ...prev,
                                fullName: e.target.value,
                              }))
                            }
                          />
                          <Input
                            placeholder="Фамилия и инициалы"
                            value={newTeacher.shortName}
                            onChange={(e) =>
                              setNewTeacher((prev) => ({
                                ...prev,
                                shortName: e.target.value,
                              }))
                            }
                          />
                          <Input
                            placeholder="Фамилия на латинице"
                            value={newTeacher.avatar}
                            onChange={(e) =>
                              setNewTeacher((prev) => ({
                                ...prev,
                                avatar: e.target.value,
                              }))
                            }
                          />
                          <Button onClick={handleEditTeacher}>Изменить</Button>
                        </Space>
                      }
                      trigger="click"
                    >
                      <EditOutlined
                        className={style.editIcon}
                        alt="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTeacherId(item._id);
                          setNewTeacher({
                            fullName: item.fullName,
                            shortName: item.shortName,
                            avatar: item.avatar,
                          });
                        }}
                      />
                    </Popover>
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
    </ConfigProvider>
  );
};
