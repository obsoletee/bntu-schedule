import { Avatar, Button, Input, List, Popover, Space, Typography } from 'antd';
import Header from '../../components/Header';
import style from './Teachers.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTeachers,
  addTeacher,
  editTeacher,
  deleteTeacher,
  setLoading,
} from '../../store/teachersReducer';
import { State } from '../../store/index'; // Adjust the import based on your store structure
import {
  TeacherImageKeys,
  teacherImages,
} from '../../assets/images/teacherImages';
import { icons } from '../../assets/icons';

export const Teachers = () => {
  const dispatch = useDispatch();
  const { teacherList, isLoading } = useSelector(
    (state: State) => state.teachers,
  );

  const { Text } = Typography;
  const [newTeacher, setNewTeacher] = useState({
    fullName: '',
    shortName: '',
    avatar: '',
  });
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [visiblePopoverId, setVisiblePopoverId] = useState<string | null>(null);

  const fetchTeachers = async () => {
    dispatch(setLoading(true));
    try {
      const response = await fetch('http://localhost:8000/teachers/');
      const data = await response.json();
      dispatch(setTeachers(data));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async () => {
    if (newTeacher.shortName && newTeacher.avatar && newTeacher.fullName) {
      try {
        const response = await fetch('http://localhost:8000/teachers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTeacher),
        });
        if (response.ok) {
          const addedTeacher = await response.json();
          dispatch(addTeacher(addedTeacher));
          setNewTeacher({ fullName: '', shortName: '', avatar: '' });
        }
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        fetchTeachers();
      }
    }
  };

  const handleEditTeacher = async () => {
    if (
      editingTeacherId &&
      newTeacher.shortName &&
      newTeacher.avatar &&
      newTeacher.fullName
    ) {
      try {
        const response = await fetch(
          `http://localhost:8000/teachers/${editingTeacherId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTeacher),
          },
        );
        if (response.ok) {
          const updatedTeacher = await response.json();
          dispatch(editTeacher(updatedTeacher));
          setNewTeacher({ fullName: '', shortName: '', avatar: '' });
          setEditingTeacherId(null);
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/teachers/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        dispatch(deleteTeacher(id));
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className={style.wrapper}>
      <Header title="Преподаватели" />
      <div className={style.container}>
        <Popover
          className={style.button}
          title={'Добавление преподавателя'}
          content={
            <Space direction="vertical">
              <Input
                placeholder="ФИО"
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
                  setNewTeacher((prev) => ({ ...prev, avatar: e.target.value }))
                }
              />
              <Button onClick={handleAddTeacher}>Добавить</Button>
            </Space>
          }
          trigger="click"
        >
          <Button
            onClick={() =>
              setNewTeacher({ fullName: '', shortName: '', avatar: '' })
            }
          >
            Добавить преподавателя
          </Button>
        </Popover>
        <List
          size="large"
          loading={isLoading}
          grid={{ column: 4, gutter: 0 }}
          itemLayout="horizontal"
          dataSource={teacherList}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={
                      teacherImages[item.avatar as TeacherImageKeys] ||
                      teacherImages.emptyAvatar
                    }
                  />
                }
                title={
                  <Space size={'large'}>
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
                            <Button onClick={handleEditTeacher}>
                              Изменить
                            </Button>
                          </Space>
                        }
                        trigger="click"
                      >
                        <img
                          className={style.editIcon}
                          src={icons.editIcon}
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
                            setVisiblePopoverId(null);
                          }
                        }}
                      >
                        <img
                          className={style.binIcon}
                          src={icons.binIcon}
                          alt="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVisiblePopoverId(
                              visiblePopoverId === item._id ? null : item._id,
                            );
                          }}
                        />
                      </Popover>
                    </div>
                  </Space>
                }
                description={
                  <Text type="secondary">Полное ФИО: {item.fullName}</Text>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};
