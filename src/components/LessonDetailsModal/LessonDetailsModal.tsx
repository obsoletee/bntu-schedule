import { Typography, Image, Space, Flex, Popover, Modal } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  teacherImages,
} from '../../assets/images/teacherImages';
import { State } from '../../store';
import { API } from '../../model/apiConst';

import styles from './LessonDetailsModal.module.scss';
import { useViewportSize } from '../../hooks/useViewportSize';
import { Subject, Teacher } from '../../model/Schedule';

interface LessonModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const LessonDetailsModal = ({
  isModalOpen,
  setIsModalOpen,
}: LessonModalProps) => {
  const { Text } = Typography;

  const { width } = useViewportSize();

  const { currentLesson } = useSelector((state: State) => state.currentLesson);

  const [teacher, setTeacher] = useState<Teacher[]>([]);
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
        return currentLesson.teacherId.includes(teacher._id);
      })
        ? teacherList.filter((teacher) => {
            return currentLesson.teacherId.includes(teacher._id);
          })
        : [],
    );
  }, [currentLesson, subjectList, teacherList]);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      onCancel={handleClose}
      onOk={handleClose}
      open={isModalOpen}
      destroyOnClose={true}
    >
      <Flex vertical gap={8}>
        <Flex>
          <Space
            style={{ maxWidth: '95%', alignItems: 'stretch', height: '100%' }}
          >
            <div
              className={styles.status}
              lesson-type={currentLesson.type}
            ></div>
            <Text
              strong
              style={
                width > 768
                  ? { fontSize: '24px' }
                  : { fontSize: '16px', lineHeight: '20px' }
              }
            >{`${subject.fullName} ${
              currentLesson.type === 'Лекция'
                ? `(ЛК)`
                : currentLesson.type === 'Практика'
                ? `(ПР)`
                : `(ЛБ)`
            }`}</Text>
          </Space>
        </Flex>
        <Flex gap={24}>
          {width > 240 ? (
            <Image
              style={{
                width: `${width < 698 ? '35vw' : '150px'}`,
                height: `${width < 698 ? '35vw' : '150px'}`,

                borderRadius: '50%',
              }}
              src={`${API.url}/teachers/${teacher[0]._id}/avatar`}
              fallback={teacherImages.emptyAvatar}
              placeholder={
                <Image
                  style={{
                    width: `${width < 698 ? '35vw' : '150px'}`,
                    height: `${width < 698 ? '35vw' : '150px'}`,

                    borderRadius: '50%',
                  }}
                  preview={false}
                  src={`${API.url}/teachers/${teacher[0]._id}/avatar`}
                />
              }
            />
          ) : (
            <></>
          )}
          <Flex vertical>
            {teacher.length === 0 ? (
              <></>
            ) : teacher.length === 1 ? (
              <Text strong style={{ fontSize: '14px', lineHeight: '18px' }}>
                {`${teacher[0].fullName} ${
                  teacher[0].degree ? `(${teacher[0].degree})` : ''
                }`}
              </Text>
            ) : teacher.length > 1 ? (
              <Popover
                trigger={'click'}
                content={
                  <Space direction="vertical">
                    {teacher.map((item, index) =>
                      index !== 0 ? (
                        <Text
                          style={{ fontSize: '14px', lineHeight: '18px' }}
                        >{`${item.fullName} ${
                          item.degree ? `(${item.degree})` : ''
                        }`}</Text>
                      ) : (
                        <></>
                      ),
                    )}
                  </Space>
                }
              >
                <Text
                  italic
                  strong
                  style={{
                    fontSize: '14px',
                    lineHeight: '18px',
                    cursor: 'pointer',
                  }}
                >{`${teacher[0].fullName} ${
                  teacher[0].degree ? `(${teacher[0].degree})` : ''
                } и еще ${teacher.length - 1}...`}</Text>
              </Popover>
            ) : (
              <></>
            )}
            <Text
              style={{ fontSize: '14px', lineHeight: '18px' }}
            >{`${currentLesson.startTime} - ${currentLesson.endTime}`}</Text>
            <Text
              type="secondary"
              style={{ fontSize: '12px', lineHeight: '16px' }}
            >
              Нед.{' '}
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
            <Flex>
              {currentLesson.class ? (
                <Text
                  type="secondary"
                  style={{ fontSize: '12px', lineHeight: '16px' }}
                >{`${currentLesson.class}`}</Text>
              ) : (
                <></>
              )}
              {currentLesson.korpus ? (
                <Text
                  type="secondary"
                  style={{ fontSize: '12px', lineHeight: '16px' }}
                >{`-${currentLesson.korpus}к`}</Text>
              ) : (
                <></>
              )}
            </Flex>

            {currentLesson ? (
              currentLesson.subgroup != '0' ? (
                <Text
                  type="secondary"
                  style={{ fontSize: '12px', lineHeight: '16px' }}
                >{`Подгруппа ${currentLesson?.subgroup}`}</Text>
              ) : (
                <></>
              )
            ) : (
              ''
            )}
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
};
