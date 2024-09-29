import { List, Typography } from 'antd';
import { lazy, Suspense } from 'react';

const Header = lazy(() => import('../../components/Header'));

import { versions } from '../../model/version';
import { CustomSpin } from '../../components/CustomSpin/CustomSpin';

import style from './VersionList.module.scss';

export const VersionsList = () => {
  const { Text, Title } = Typography;
  return (
    <div className={style.wrapper}>
      <Suspense fallback={<CustomSpin />}>
        <Header />
      </Suspense>
      <div className={style.container}>
        <Title level={3}>История изменений</Title>
        <List
          itemLayout="horizontal"
          dataSource={[...versions].reverse()}
          renderItem={(item) => (
            <List.Item key={item.title}>
              <List.Item.Meta
                key={item.title}
                title={
                  <div className={style.version_title}>
                    <Text>Версия {item.title}: </Text>{' '}
                    <Text type="secondary">{item.date}</Text>
                  </div>
                }
                description={item.changes.map((string) => (
                  <div>
                    <Text>{`- ${string}`}</Text>
                  </div>
                ))}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};
