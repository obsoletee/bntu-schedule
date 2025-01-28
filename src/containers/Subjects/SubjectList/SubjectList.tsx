import { Button, ConfigProvider, List, Popover, Space, Typography } from 'antd';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import { Dispatch, lazy, SetStateAction, Suspense, useState } from 'react';
import { useDispatch } from 'react-redux';

import { CustomSpin } from '../../../components/CustomSpin/CustomSpin';
import { State } from '../../../store';
import { useViewportSize } from '../../../hooks/useViewportSize';
import { useSelector } from 'react-redux';

const EditItemModal = lazy(() => import('../../../components/EditItemModal'));

import style from './SubjectList.module.scss';
import { setCurrentSubject } from '../../../store/currentSubjectReducer';

interface SubjectListProps {
  handleDeleteSubject: (id: string) => Promise<void>;
  visiblePopoverId: string | undefined;
  setVisiblePopoverId: Dispatch<SetStateAction<string | undefined>>;
}

export const SubjectList = ({
  handleDeleteSubject,
  visiblePopoverId,
  setVisiblePopoverId,
}: SubjectListProps) => {
  const dispatch = useDispatch();
  const { Text } = Typography;
  const { width } = useViewportSize();

  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);

  const { subjectList, isSubjectsLoading } = useSelector(
    (state: State) => state.subjects,
  );

  return (
    <>
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
                      <EditOutlined
                        className={style.editIcon}
                        alt="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setCurrentSubject(item));
                          setIsEditItemModalOpen(true);
                        }}
                      />
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
      <Suspense fallback={<CustomSpin />}>
        <EditItemModal
          isEditItemModalOpen={isEditItemModalOpen}
          setIsEditItemModalOpen={setIsEditItemModalOpen}
        />
      </Suspense>
    </>
  );
};
