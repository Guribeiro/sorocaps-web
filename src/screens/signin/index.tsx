/* eslint-disable react/no-unstable-nested-components */
import { useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Anchor,
  Form,
  Input,
  Layout,
  Typography,
  Image,
  Row,
  Col,
  Space,
  Button,
  message,
} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../hooks/auth';
import logoSource from '../../assets/sorocaps.png';
import './styles.css';

const { Content } = Layout;
const { Title } = Typography;

type FormData = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string(),
});

function SignIn(): JSX.Element {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async ({ email, password }: FormData) => {
      try {
        await signin({
          email,
          password,
        });

        navigate('/dashboard', { replace: true, state });
      } catch (error) {
        message.error('Falha no login');
      }
    },
    [signin, navigate, state],
  );

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Space
        size={30}
        direction="vertical"
        style={{ flexDirection: 'column', maxWidth: 460, margin: '0 auto' }}
      >
        <Row justify="center">
          <Col>
            <Image
              className="logo-image"
              src={logoSource}
              alt="Sorocaps logo"
            />
          </Col>
        </Row>
        <Row justify="center">
          <Content>
            <Title level={3}>Login</Title>
            <Form
              layout="vertical"
              onSubmitCapture={handleSubmit(onSubmit)}
              style={{ paddingBottom: 30 }}
            >
              <Col span={24}>
                <Form.Item name={['email']} label="Email">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        size="large"
                        placeholder="Ex. johndoe@email.com"
                        onChange={onChange}
                        value={value}
                      />
                    )}
                  />
                </Form.Item>

                <Form.Item name={['password']} label="Senha">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input.Password
                        size="large"
                        placeholder="input password"
                        iconRender={visible =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        onChange={onChange}
                        value={value}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
              <Button type="primary" block size="large" htmlType="submit">
                Login
              </Button>
            </Form>
            <Row justify="center">
              <Anchor>
                <Link title="Criar conta" to="/signup">
                  Ainda não tem uma conta?
                </Link>
              </Anchor>
            </Row>
          </Content>
        </Row>
      </Space>
    </Layout>
  );
}

export default SignIn;
