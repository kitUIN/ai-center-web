import { useNotification } from '../utils/notification/Notification';
import { Button } from '@fluentui/react-components';

const Home = () => {
  const { showNotification } = useNotification();

  const handleSuccess = () => {
    showNotification('请求成功！', 'success');
  };

  const handleError = () => {
    showNotification('请求失败！', 'error');
  };

  return <div>
  <Button onClick={handleSuccess}>成功通知</Button>
  <Button onClick={handleError}>失败通知</Button>
</div>
}

export default Home