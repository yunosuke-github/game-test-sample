import {auth, db, provider} from '../firebase';
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import {addDoc, collection, onSnapshot, orderBy, query} from "firebase/firestore";
import * as React from "react";
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import {
  Layout,
  Button,
  Popconfirm,
  Space,
  Form,
  List,
  Input,
  Col,
  Row,
  Avatar,
  Upload,
  message,
} from 'antd';

const { Header, Footer, Sider, Content } = Layout;
const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
const headerStyle: React.CSSProperties = {
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#001628',
};

const Chat = () => {

  const navigation = useNavigate()
  const [messageApi, contextHolder] = message.useMessage();
  const [userName, setUserName] = useState("")
  const [postMessage, setPostMessage] = useState("")
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // ログインチェック
    const unsubscribed = auth.onAuthStateChanged((user) => {
      if (user == null) {
        navigation('/signin')
      }
    });

    // データをリアルタイムで取得
    const usersCollectionRef = collection(db, 'chat');
    const q = query(usersCollectionRef, orderBy('post_date', 'desc'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsub;
  }, []);

  const onChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value)
  }

  const onChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostMessage(event.target.value)
  }

  const logout = async (event) => {
    auth.signOut();
  }

  const messageBox = (type, content) => {
    messageApi.open({
      type: type,
      content: content,
    });
  };

  const onClickPostMessage = async() => {
    if (postMessage == "") {
      messageBox("error", "メッセージを入力してください")
      return
    }
    const now = new Date();
    const usersCollectionRef = collection(db, 'chat');
    const documentRef = await addDoc(usersCollectionRef, {
      user_name: userName,
      message: postMessage,
      post_date: now.toLocaleString()
    });
    // setUserName("")
    setPostMessage("")
    messageBox("success", "メッセージの投稿に成功")
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
      <Layout>
        <Header style={headerStyle}>
          <Row>
            <Col span={22}>React × Firebase動作確認（閲覧している人にリアルタイムで投稿が表示されるはず...）</Col>
            <Col span={1}>
              <Button onClick={logout}>Logout</Button>
            </Col>
          </Row>
        </Header>
        <Content>
          <Form
            layout="horizontal"
            style={{ padding: 20 }}
          >
            <Form.Item label="投稿者名" style={{ width: '20%' }}>
              <Input placeholder="投稿者名" value={userName} onChange={onChangeUserName} />
            </Form.Item>
            <Form.Item label="メッセージ" name="message" style={{ width: '50%' }} rules={[{ required: true }]}>
              <Input placeholder="メッセージ" value={postMessage} onChange={onChangeMessage} />
              <div style={{display: 'none'}}>{postMessage}</div>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={onClickPostMessage}>送信</Button>
            </Form.Item>
          </Form>
          <List
            itemLayout="vertical"
            size="large"
            style={{background: '#fff', height: '200px' }}
            dataSource={messages}
            renderItem={(message) => (
              <List.Item
                key={message.id}
                actions={[
                  <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                  <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                  <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={'https://xsgames.co/randomusers/avatar.php?g=pixel&key=0'} />}
                  title={message.user_name == '' ? '匿名さん' : message.user_name }
                  description={message.post_date}
                />
                {message.message}
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </Space>
  );
};

export default Chat;