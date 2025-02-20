import { Modal, Typography, Image, Space } from 'antd';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import {
  TeacherImageKeys,
  teacherImages,
} from '../../assets/images/teacherImages';
import { State } from '../../store';

import style from './LessonModal.module.scss';
import { useViewportSize } from '../../hooks/useViewportSize';
import { Subject, Teacher } from '../../model/Schedule';

interface LessonModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const LessonModal = ({
  isModalOpen,
  setIsModalOpen,
}: LessonModalProps) => {
  const { Text } = Typography;

  const { width } = useViewportSize();

  const { currentLesson } = useSelector((state: State) => state.currentLesson);

  const [teacher, setTeacher] = useState<Teacher>({
    _id: '',
    avatar: 'emptyAvatar',
    fullName: '',
    shortName: '',
    degree: '',
    university: {
      code: '',
      title: '',
    },
  });
  const [subject, setSubject] = useState<Subject>({
    _id: '',
    fullName: '',
    shortName: '',
  });

  const { subjectList } = useSelector((state: State) => state.subjects);
  const { teacherList } = useSelector((state: State) => state.teachers);

  useEffect(() => {
    setSubject(
      subjectList.filter((subject) => {
        return subject._id === currentLesson.subjectId;
      })[0]
        ? subjectList.filter((subject) => {
            return subject._id === currentLesson.subjectId;
          })[0]
        : { _id: '', fullName: '', shortName: '' },
    );

    setTeacher(
      teacherList.filter((teacher) => {
        return teacher._id === currentLesson.teacherId;
      })[0]
        ? teacherList.filter((teacher) => {
            return teacher._id === currentLesson.teacherId;
          })[0]
        : {
            _id: '',
            avatar: 'emptyAvatar',
            fullName: '',
            shortName: '',
            degree: '',
            university: {
              code: '',
              title: '',
            },
          },
    );
  }, [currentLesson, subjectList, teacherList]);

  const avatarKey = useMemo(() => {
    return teacher.avatar.toLowerCase() as TeacherImageKeys;
  }, [teacher.avatar]);

  const handleOk = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  return (
    <Modal
      title={
        <Space
          style={{ maxWidth: '95%', alignItems: 'stretch', height: '100%' }}
        >
          <div className={style.status} lesson-type={currentLesson.type}></div>
          <Text
            style={width > 768 ? { fontSize: '24px' } : { fontSize: '16px' }}
          >{`${subject.fullName} ${
            currentLesson.type === 'Лекция'
              ? `(ЛК)`
              : currentLesson.type === 'Практика'
              ? `(ПР)`
              : `(ЛБ)`
          }`}</Text>
        </Space>
      }
      open={isModalOpen}
      onOk={handleOk}
      okText="Ок"
      onCancel={handleCancel}
      cancelText="Назад"
    >
      <div className={style.container}>
        <div className={style.description_container}>
          <Text>
            <b>
              {`${teacher.fullName} ${
                teacher.degree ? `(${teacher.degree})` : ''
              }`}
            </b>
          </Text>
          <Text>{`Время: ${currentLesson.startTime} - ${currentLesson.endTime}`}</Text>
          <Text>{`Аудитория: ${currentLesson.class}-${currentLesson.korpus}к`}</Text>
          <Text>
            Недели:{' '}
            {currentLesson.week.length > 0 ? (
              <>
                {currentLesson.week.slice(0, -1).join(', ')}
                {currentLesson.week.length > 1
                  ? `, ${currentLesson?.week[currentLesson.week.length - 1]}`
                  : `${currentLesson?.week[0]}`}
              </>
            ) : (
              'Нет данных.'
            )}
          </Text>
          {currentLesson ? (
            currentLesson.subgroup != '0' ? (
              <Text strong>{`Подгруппа ${currentLesson?.subgroup}`}</Text>
            ) : (
              <></>
            )
          ) : (
            ''
          )}
        </div>
        {width > 240 ? (
          <div className={style.photo_wrapper}>
            <Image
              className={style.avatar}
              src={teacherImages[avatarKey]}
              fallback={teacherImages.emptyAvatar}
              placeholder={
                <Image preview={false} src={teacherImages.emptyAvatar} />
              }
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </Modal>
  );
};
