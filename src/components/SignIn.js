import {auth, db, provider} from '../firebase';
import { signInWithRedirect } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import { Image, Spin } from 'antd';


const SignIn = () => {

  const navigation = useNavigate()

  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    // firebaseからログイン情報を取得
    const unsubscribed = auth.onAuthStateChanged((user) => {
      if (user != null) {
        navigation('/')
      }
    });
  }, []);

  const handleLogin = async (event) => {
    try {
      await signInWithRedirect(auth, provider)
    } catch (error) {
      // setError(error.message);
      setSpinning(false)
    }
  };

  return (
    <>
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin tip="ログイン処理中..." spinning={spinning}>
          <div style={{ fontSize: 32, fontWeight: 'bold' }}>ログイン</div>
          <div>ログイン後リダイレクトに少し時間かかる...</div>
          <Image
            preview={false}
            width={200}
            src="/google-signin-btn.png"
            style={{ cursor: 'pointer' }}
            onClick={handleLogin}
          />
        </Spin>
      </div>

    </>
  );
};

export default SignIn;