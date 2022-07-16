/* eslint-disable react/no-unstable-nested-components */
import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from 'antd';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import logoSource from '../../assets/sorocaps.png';
import './styles.css';

const { Content } = Layout;
const { Title } = Typography;

type FormData = {
  full_name: string;
  username: string;
  email: string;
};

const schema = yup.object().shape({
  full_name: yup.string().required('Nome completo é um campo obrigatório'),
  email: yup
    .string()
    .email('Formato inválido')
    .required('Informe o seu email')
    .required('Email é um campo obrigatório'),
  username: yup
    .string()
    .min(8, 'Formato inválido, username deve ter mínimo de 08 caracteres'),
});

function SignUp(): JSX.Element {
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      full_name: '',
      username: '',
      email: '',
    },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = useCallback(
    ({ full_name, username, email }: FormData) => {
      navigate('/define-password', { state: { full_name, username, email } });
    },
    [navigate],
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
            <Title level={3}>Criar conta</Title>
            <Form
              layout="vertical"
              onSubmitCapture={handleSubmit(onSubmit)}
              style={{ paddingBottom: 30 }}
            >
              <Col span={24}>
                <Controller
                  name="full_name"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Form.Item
                      name={['full_name']}
                      label="Nome"
                      validateStatus={error?.message && 'error'}
                      hasFeedback
                      help={error?.message}
                    >
                      <Input
                        size="large"
                        placeholder="Ex. johndoe@email.com"
                        onChange={onChange}
                        value={value}
                      />
                    </Form.Item>
                  )}
                />

                <Controller
                  name="username"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Form.Item
                      name={['username']}
                      label="Username"
                      validateStatus={error?.message && 'error'}
                      hasFeedback
                      help={error?.message}
                    >
                      <Input
                        size="large"
                        placeholder="Ex. MyUsername"
                        onChange={onChange}
                        value={value}
                      />
                    </Form.Item>
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Form.Item
                      name={['email']}
                      label="Email"
                      validateStatus={error?.message && 'error'}
                      hasFeedback
                      help={error?.message}
                    >
                      <Input
                        size="large"
                        placeholder="Ex. johndoe@email.com"
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
                Próximo
              </Button>
            </Form>
            <Row justify="center">
              <Anchor>
                <Link title="Criar conta" to="/">
                  Já possuí uma conta?
                </Link>
              </Anchor>
            </Row>
          </Content>
        </Row>
      </Space>
    </Layout>
  );
}

export default SignUp;
