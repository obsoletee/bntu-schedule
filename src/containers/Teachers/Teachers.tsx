import { Avatar, Button, Input, List, Popover, Space, Typography } from 'antd';
import Header from '../../components/Header';
import style from './Teachers.module.scss';
import { useEffect, useState } from 'react';
import { teacherImages } from '../../assets/images/teacherImages';
import { icons } from '../../assets/icons';

type TeacherImageKeys = keyof typeof teacherImages;

interface TeacherList {
  _id: string;
  shortName: string;
  fullName: string;
  avatar: TeacherImageKeys;
}

interface NewTeacher {
  fullName: string;
  shortName: string;
  avatar: string;
}

export const Teachers = () => {
  const [newTeacher, setNewTeacher] = useState<NewTeacher>({
    fullName: '',
    shortName: '',
    avatar: '',
  });
  const [teacherList, setTeacherList] = useState<TeacherList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  const { Text } = Typography;

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/teachers/');
      const data = await response.json();
      setTeacherList(data);
    } finally {
      setIsLoading(false);
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTeacher),
        });
        if (response.ok) {
          const addedTeacher = await response.json();
          setTeacherList((prev) => [...prev, addedTeacher]);
          setNewTeacher({ fullName: '', shortName: '', avatar: '' });
        } else {
          console.error('Ошибка при добавлении преподавателя');
        }
      } catch (error) {
        console.error('Ошибка:', error);
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
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTeacher),
          },
        );
        if (response.ok) {
          const updatedTeacher = await response.json();
          setTeacherList((prev) =>
            prev.map((teacher) =>
              teacher._id === editingTeacherId ? updatedTeacher : teacher,
            ),
          );
          setNewTeacher({ fullName: '', shortName: '', avatar: '' });
          setEditingTeacherId(null);
        } else {
          console.error('Ошибка при обновлении преподавателя');
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
        setTeacherList((prev) => prev.filter((teacher) => teacher._id !== id));
      } else {
        console.error('Ошибка при удалении преподавателя');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className={style.wrapper}>
      <Header />

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
                  setNewTeacher((prev) => ({
                    ...prev,
                    avatar: e.target.value as TeacherImageKeys,
                  }))
                }
              />
              <Button onClick={handleAddTeacher}>Добавить</Button>
            </Space>
          }
          trigger="click"
        >
          <Button
            onClick={() => {
              setNewTeacher({ fullName: '', shortName: '', avatar: '' });
            }}
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
                      teacherImages[item.avatar] || teacherImages.emptyAvatar
                    }
                  />
                }
                title={
                  <Space size={'large'}>
                    <Text style={{ fontSize: '24px' }} strong>
                      {item.shortName}
                    </Text>

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
                                  avatar: e.target.value as TeacherImageKeys,
                                }))
                              }
                            />
                            <Button
                              onClick={async () => {
                                await handleEditTeacher();
                              }}
                            >
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
                              onClick={() => {
                                handleDeleteTeacher(item._id);
                              }}
                            >
                              <Text type="danger">Да</Text>
                            </Button>
                          </Space>
                        }
                        trigger="click"
                      >
                        <img
                          className={style.binIcon}
                          src={icons.binIcon}
                          alt="delete"
                          onClick={(e) => {
                            e.stopPropagation();
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
