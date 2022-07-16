/* eslint-disable react/no-unstable-nested-components */
import { useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAuth } from '../../hooks/auth';
import logoSource from '../../assets/sorocaps.png';
import './styles.css';

const { Content } = Layout;
const { Title } = Typography;

type FormData = {
  password: string;
  password_confirmation: string;
};

type DefinePasswordScreenState = {
  full_name: string;
  username: string;
  email: string;
};

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Formato inválido, mínimo de 08 caracteres')
    .required('Senha é um campo obrigatório'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'As senhas devem coincidir'),
});

function DefinePassword(): JSX.Element {
  const { signup } = useAuth();
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
    resolver: yupResolver(schema),
  });

  const { state } = useLocation();
  const navigate = useNavigate();

  const { full_name, email, username } = state as DefinePasswordScreenState;

  const onSubmit = useCallback(
    async ({ password }: FormData) => {
      try {
        await signup({
          full_name,
          username,
          email,
          password,
        });

        message.success('usuário criado com sucesso');
        navigate('/');
      } catch (error) {
        message.error('Não foi possível criar usuário');
      }
    },
    [full_name, username, email, signup, navigate],
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
            <Title level={3}>Definir senha</Title>
            <Form
              layout="vertical"
              onSubmitCapture={handleSubmit(onSubmit)}
              style={{ paddingBottom: 30 }}
            >
              <Col span={24}>
                <Controller
                  name="password"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Form.Item
                      name={['password']}
                      label="Senha"
                      validateStatus={error?.message && 'error'}
                      hasFeedback
                      help={error?.message}
                    >
                      <Input.Password
                        size="large"
                        placeholder="Senha"
                        iconRender={visible =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        onError={() => message.error('algo deu errado')}
                        onChange={onChange}
                        value={value}
                      />
                    </Form.Item>
                  )}
                />

                <Controller
                  name="password_confirmation"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Form.Item
                      name={['password_confirmation']}
                      label="Confirmar senha"
                      validateStatus={error?.message && 'error'}
                      hasFeedback
                      help={error?.message}
                    >
                      <Input.Password
                        size="large"
                        placeholder="Confirmar senha"
                        iconRender={visible =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        onChange={onChange}
                        value={value}
                      />
                    </Form.Item>
                  )}
                />
              </Col>
              <Button
                type="primary"
                block
                size="large"
                htmlType="submit"
                style={{ marginTop: 40 }}
              >
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

export default DefinePassword;
