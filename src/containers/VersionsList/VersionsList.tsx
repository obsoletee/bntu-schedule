import { List, Typography } from 'antd';
import { Header } from '../../components/Header';
import style from './VersionList.module.scss';
import { versions } from '../../model/version';

export const VersionsList = () => {
  const { Text, Title } = Typography;
  return (
    <div className={style.wrapper}>
      <Header />
      <div className={style.container}>
        <Title level={3}>История изменений</Title>
        <List
          itemLayout="horizontal"
          dataSource={versions.reverse()}
          renderItem={(item) => (
            <List.Item key={item.title}>
              <List.Item.Meta
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
