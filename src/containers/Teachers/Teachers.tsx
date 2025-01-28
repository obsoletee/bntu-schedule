import { Button, Input, Popover, Space } from 'antd';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { API } from '../../model/apiConst';
import {
  setTeachers,
  addTeacher,
  editTeacher,
  deleteTeacher,
  setTeachersLoading,
} from '../../store/teachersReducer';

const Header = lazy(() => import('../../components/Header'));
const TeacherList = lazy(() => import('./TeacherList'));

import style from './Teachers.module.scss';
import { CustomSpin } from '../../components/CustomSpin/CustomSpin';
export const Teachers = () => {
  const dispatch = useDispatch();

  const [newTeacher, setNewTeacher] = useState({
    fullName: '',
    shortName: '',
    avatar: '',
  });
  const [editingTeacherId, setEditingTeacherId] = useState<string | undefined>(
    undefined,
  );
  const [visiblePopoverId, setVisiblePopoverId] = useState<string | undefined>(
    undefined,
  );

  const fetchTeachers = useCallback(async () => {
    dispatch(setTeachersLoading(true));
    try {
      const response = await fetch(`${API.url}/teachers/`);
      const data = await response.json();
      dispatch(setTeachers(data));
    } finally {
      dispatch(setTeachersLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleAddTeacher = async () => {
    if (newTeacher.shortName && newTeacher.avatar && newTeacher.fullName) {
      try {
        const response = await fetch(`${API.url}/teachers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTeacher),
        });
        if (response.ok) {
          const addedTeacher = await response.json();
          dispatch(addTeacher(addedTeacher));
        }
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setNewTeacher({ fullName: '', shortName: '', avatar: '' });
        fetchTeachers();
      }
    }
  };

  const handleEditTeacher = useCallback(async () => {
    if (
      editingTeacherId &&
      newTeacher.shortName &&
      newTeacher.avatar &&
      newTeacher.fullName
    ) {
      try {
        const response = await fetch(
          `${API.url}/teachers/${editingTeacherId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTeacher),
          },
        );
        if (response.ok) {
          const updatedTeacher = await response.json();
          dispatch(editTeacher(updatedTeacher));
        }
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setNewTeacher({ fullName: '', shortName: '', avatar: '' });
        setEditingTeacherId(undefined);
      }
    }
  }, [dispatch, editingTeacherId, newTeacher]);

  const handleDeleteTeacher = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`${API.url}/teachers/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          dispatch(deleteTeacher(id));
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    },
    [dispatch],
  );

  return (
    <div className={style.wrapper}>
      <Suspense fallback={<CustomSpin />}>
        <Header title="Преподаватели" />
      </Suspense>
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
        <Suspense fallback={<CustomSpin />}>
          <TeacherList
            newTeacher={newTeacher}
            setNewTeacher={setNewTeacher}
            handleDeleteTeacher={handleDeleteTeacher}
            handleEditTeacher={handleEditTeacher}
            setEditingTeacherId={setEditingTeacherId}
            visiblePopoverId={visiblePopoverId}
            setVisiblePopoverId={setVisiblePopoverId}
          />
        </Suspense>
      </div>
    </div>
  );
};
