import { Button, Input, List, Popover, Space, Typography } from 'antd';
import Header from '../../components/Header';
import style from './Subjects.module.scss';
import { useEffect, useState } from 'react';

import { icons } from '../../assets/icons';

interface SubjectList {
  _id: string;
  shortName: string;
  fullName: string;
}

interface NewSubject {
  fullName: string;
  shortName: string;
}

export const Subjects = () => {
  const [newSubject, setNewSubject] = useState<NewSubject>({
    fullName: '',
    shortName: '',
  });
  const [SubjectList, setSubjectList] = useState<SubjectList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  const { Text } = Typography;

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/Subjects/');
      const data = await response.json();
      setSubjectList(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async () => {
    if (newSubject.shortName && newSubject.fullName) {
      try {
        const response = await fetch('http://localhost:8000/Subjects/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSubject),
        });
        if (response.ok) {
          const addedSubject = await response.json();
          setSubjectList((prev) => [...prev, addedSubject]);
          setNewSubject({ fullName: '', shortName: '' });
        } else {
          console.error('Ошибка при добавлении предмета');
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  };

  const handleEditSubject = async () => {
    if (editingSubjectId && newSubject.shortName && newSubject.fullName) {
      try {
        const response = await fetch(
          `http://localhost:8000/Subjects/${editingSubjectId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSubject),
          },
        );
        if (response.ok) {
          const updatedSubject = await response.json();
          setSubjectList((prev) =>
            prev.map((Subject) =>
              Subject._id === editingSubjectId ? updatedSubject : Subject,
            ),
          );
          setNewSubject({ fullName: '', shortName: '' });
          setEditingSubjectId(null);
        } else {
          console.error('Ошибка при обновлении предмета');
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/Subjects/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSubjectList((prev) => prev.filter((Subject) => Subject._id !== id));
      } else {
        console.error('Ошибка при удалении предмета');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className={style.wrapper}>
      <Header title="Предметы" />

      <div className={style.container}>
        <Popover
          className={style.button}
          title={'Добавление предмета'}
          content={
            <Space direction="vertical">
              <Input
                placeholder="Полное название"
                value={newSubject.fullName}
                onChange={(e) =>
                  setNewSubject((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Сокращенное название"
                value={newSubject.shortName}
                onChange={(e) =>
                  setNewSubject((prev) => ({
                    ...prev,
                    shortName: e.target.value,
                  }))
                }
              />
              <Button onClick={handleAddSubject}>Добавить</Button>
            </Space>
          }
          trigger="click"
        >
          <Button
            onClick={() => {
              setNewSubject({ fullName: '', shortName: '' });
            }}
          >
            Добавить предмет
          </Button>
        </Popover>
        <List
          size="large"
          loading={isLoading}
          grid={{ column: 4, gutter: 0 }}
          itemLayout="horizontal"
          dataSource={SubjectList}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space size={'large'}>
                    <Text style={{ fontSize: '24px' }} strong>
                      {item.shortName}
                    </Text>

                    <div className={style.icon_container}>
                      <Popover
                        title={'Изменение предмета'}
                        content={
                          <Space direction="vertical">
                            <Input
                              placeholder="Полное название"
                              value={newSubject.fullName}
                              onChange={(e) =>
                                setNewSubject((prev) => ({
                                  ...prev,
                                  fullName: e.target.value,
                                }))
                              }
                            />
                            <Input
                              placeholder="Сокращенное название"
                              value={newSubject.shortName}
                              onChange={(e) =>
                                setNewSubject((prev) => ({
                                  ...prev,
                                  shortName: e.target.value,
                                }))
                              }
                            />
                            <Button
                              onClick={async () => {
                                await handleEditSubject();
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
                            setEditingSubjectId(item._id);
                            setNewSubject({
                              fullName: item.fullName,
                              shortName: item.shortName,
                            });
                          }}
                        />
                      </Popover>
                      <Popover
                        title={'Вы уверены, что хотите удалить этот предмет?'}
                        content={
                          <Space>
                            <Button
                              onClick={() => {
                                handleDeleteSubject(item._id);
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
                  <Text type="secondary">Полное название: {item.fullName}</Text>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};
