import {
  Button,
  ConfigProvider,
  Input,
  List,
  Popover,
  Space,
  Typography,
} from 'antd';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';

import { Dispatch, SetStateAction } from 'react';
import { useViewportSize } from '../../../hooks/useViewportSize';
import { useSelector } from 'react-redux';
import { State } from '../../../store';

import style from './SubjectList.module.scss';

interface NewSubjectData {
  shortName: string;
  fullName: string;
}

interface SubjectListProps {
  newSubject: NewSubjectData;
  handleEditSubject: () => Promise<void>;
  setNewSubject: Dispatch<SetStateAction<NewSubjectData>>;
  setEditingSubjectId: Dispatch<SetStateAction<string | undefined>>;
  handleDeleteSubject: (id: string) => Promise<void>;
  visiblePopoverId: string | undefined;
  setVisiblePopoverId: Dispatch<SetStateAction<string | undefined>>;
}

export const SubjectList = ({
  newSubject,
  handleEditSubject,
  setNewSubject,
  setEditingSubjectId,
  handleDeleteSubject,
  visiblePopoverId,
  setVisiblePopoverId,
}: SubjectListProps) => {
  const { Text } = Typography;
  const { width } = useViewportSize();

  const { subjectList, isSubjectsLoading } = useSelector(
    (state: State) => state.subjects,
  );
  return (
    <ConfigProvider
      theme={{
        components: {
          List: {
            itemPaddingLG: width < 768 ? '16px 8px' : '16px 24px',
          },
        },
      }}
    >
      <List
        size="large"
        loading={isSubjectsLoading}
        grid={
          width > 1024
            ? { column: 4, gutter: 0 }
            : width > 768
            ? { column: 2, gutter: 0 }
            : { column: 1, gutter: 0 }
        }
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
                          <Button onClick={handleEditSubject}>Изменить</Button>
                        </Space>
                      }
                      trigger="click"
                    >
                      <EditOutlined
                        className={style.editIcon}
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
