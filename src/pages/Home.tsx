import { useNotification } from "../utils/notification/Notification";
import { Button } from "@fluentui/react-components";

const Home = () => {
  const { showNotification } = useNotification();

  const handleSuccess = () => {
    showNotification("请求成功！", "success");
  };

  const handleError = () => {
    showNotification("请求失败！", "error");
  };

  const handleLogin = () => {
    // 例如使用 fetch 进行登录请求
    fetch("https://f1a7-82-152-142-61.ngrok-free.app/api/ai/center/login/", {
      method: "POST",
      credentials: "include", // 允许携带凭证（Cookie）
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: "kulujun@gmail.com",
        password: "bala1234", 
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Login successful");
        } else {
          console.error("Login failed");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <Button onClick={handleSuccess}>成功通知</Button>
      <Button onClick={handleError}>失败通知</Button>
      <Button onClick={handleLogin}>测试跳转登录</Button>
    </div>
  );
};

export default Home;
