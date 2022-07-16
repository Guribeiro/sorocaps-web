/* eslint-disable react/forbid-prop-types */
import { useCallback, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MaskedInput } from 'antd-mask-input';
import {
  Layout,
  PageHeader,
  Form,
  Input,
  Row,
  Col,
  Button,
  Typography,
  message,
  Result,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useCustomers } from '../../hooks/customers';

const { Content } = Layout;
const { Title } = Typography;

type FormData = {
  cnpj: string;
  corporate_name: string;
  phone: string;
};

const schema = yup.object().shape({
  cnpj: yup.string().required('Informe o CNPJ do cliente'),
  corporate_name: yup.string().required('Informe a razão social'),
  phone: yup.string().required('Informe um telefone de contato'),
});

function RegisterCustomer(): JSX.Element {
  const navigate = useNavigate();
  const { create } = useCustomers();
  const [isResultVisible, setIsResultVisible] = useState(false);

  const { handleSubmit, control, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async ({ cnpj, corporate_name, phone }: FormData) => {
      try {
        await create({
          cnpj,
          corporate_name,
          phone,
        });

        message.success('cliente cadastrado com sucesso');

        reset();
        setIsResultVisible(true);
      } catch (error) {
        message.error('Falha no cadastro do cliente');
      }
    },
    [reset, create],
  );

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      {isResultVisible ? (
        <Result
          status="success"
          title="Cliente cadastrado com sucesso"
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => navigate('/dashboard')}
            >
              Voltar ao ínicio
            </Button>,
            <Button key="buy" onClick={() => setIsResultVisible(false)}>
              Cadastrar novo cliente
            </Button>,
          ]}
        />
      ) : (
        <>
          <PageHeader title="Voltar" onBack={() => navigate('/dashboard')} />

          <Row justify="center">
            <Content style={{ maxWidth: 680 }}>
              <Title level={3}>Cadastrar novo cliente</Title>
              <Form
                layout="vertical"
                onSubmitCapture={handleSubmit(onSubmit)}
                style={{ paddingBottom: 30 }}
              >
                <Col span={24}>
                  <Controller
                    name="cnpj"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['cnpj']}
                        label="CNPJ"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <MaskedInput
                          mask="00.000.000/0000-00"
                          size="large"
                          placeholder="Ex. XX.XXX.XXX/0001-XX"
                          onChange={onChange}
                          value={value}
                          defaultValue={value}
                        />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="corporate_name"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['corporate_name']}
                        label="Razão social"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <Input size="large" onChange={onChange} value={value} />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['phone']}
                        label="Telefone de contato"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <MaskedInput
                          mask="+55 (00) 0000-0000"
                          size="large"
                          placeholder="Ex. (55) 99999-9999"
                          onChange={onChange}
                          value={value}
                        />
                      </Form.Item>
                    )}
                  />
                </Col>
                <Row gutter={30} style={{ marginTop: 30 }}>
                  <Col span={12}>
                    <Button type="primary" block size="large" htmlType="submit">
                      Cadastrar
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      type="ghost"
                      block
                      size="large"
                      htmlType="reset"
                      onClick={() => reset()}
                    >
                      Limpar formulário
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Content>
          </Row>
        </>
      )}
    </Layout>
  );
}

export default RegisterCustomer;
