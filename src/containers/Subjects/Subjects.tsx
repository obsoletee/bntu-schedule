import { Button, Input, List, Popover, Space, Typography } from 'antd';
import Header from '../../components/Header';
import style from './Subjects.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSubjects,
  addSubject,
  editSubject,
  deleteSubject,
  setLoading,
} from '../../store/subjectsReducer';
import { State } from '../../store/index';

import { icons } from '../../assets/icons';

export const Subjects = () => {
  const dispatch = useDispatch();
  const { subjectList, isLoading } = useSelector(
    (state: State) => state.subjects,
  );

  const { Text } = Typography;
  const [newSubject, setNewSubject] = useState({
    fullName: '',
    shortName: '',
  });
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [visiblePopoverId, setVisiblePopoverId] = useState<string | null>(null);

  const fetchSubjects = async () => {
    dispatch(setLoading(true));
    try {
      const response = await fetch('http://localhost:8000/subjects/');
      const data = await response.json();
      dispatch(setSubjects(data));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async () => {
    if (newSubject.shortName && newSubject.fullName) {
      try {
        const response = await fetch('http://localhost:8000/subjects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSubject),
        });
        if (response.ok) {
          const addedSubject = await response.json();
          dispatch(addSubject(addedSubject));
          setNewSubject({ fullName: '', shortName: '' });
        }
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        fetchSubjects();
      }
    }
  };

  const handleEditSubject = async () => {
    if (editingSubjectId && newSubject.shortName && newSubject.fullName) {
      try {
        const response = await fetch(
          `http://localhost:8000/subjects/${editingSubjectId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSubject),
          },
        );
        if (response.ok) {
          const updatedSubject = await response.json();
          dispatch(editSubject(updatedSubject));
          setNewSubject({ fullName: '', shortName: '' });
          setEditingSubjectId(null);
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/subjects/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        dispatch(deleteSubject(id));
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
            onClick={() => setNewSubject({ fullName: '', shortName: '' })}
          >
            Добавить предмет
          </Button>
        </Popover>
        <List
          size="large"
          loading={isLoading}
          grid={{ column: 4, gutter: 0 }}
          itemLayout="horizontal"
          dataSource={subjectList}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space size={'large'}>
                    <Text strong>{item.shortName}</Text>
                    <div className={style.icon_container}>
                      <Popover
                        title={'Редактирование предмета'}
                        content={
                          <Space direction="vertical">
                            <Input
                              placeholder="Полное назваие"
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
                            <Button onClick={handleEditSubject}>
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
