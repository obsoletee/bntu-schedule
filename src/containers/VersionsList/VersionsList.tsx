import { Timeline, Typography } from 'antd';
import { lazy, Suspense } from 'react';

import { versions } from '../../model/version';
import { CustomSpin } from '../../components/CustomSpin/CustomSpin';

const Header = lazy(() => import('../../components/Header'));

import style from './VersionList.module.scss';

export const VersionsList = () => {
  const { Text, Title } = Typography;
  return (
    <div className={style.wrapper}>
      <Suspense fallback={<CustomSpin />}>
        <Header title="Обновления" />
      </Suspense>
      <div className={style.container}>
        <Title style={{ marginBottom: '30px' }} level={3}>
          История изменений
        </Title>
        <Timeline reverse>
          {versions.map((version) => (
            <Timeline.Item key={version.title}>
              <div className={style.version_title}>
                <Text strong>Версия {version.title}: </Text>{' '}
                <Text type="secondary">{version.date}</Text>
              </div>
              {version.changes.map((string) => (
                <div>
                  <Text>{`- ${string}`}</Text>
                </div>
              ))}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
};
