/* eslint-disable react/forbid-prop-types */
import { useCallback, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

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
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useCustomers } from '../../hooks/customers';

const { Content } = Layout;
const { Title } = Typography;

type FormData = {
  cep: string;
  number: string;
  district: string;
  country: string;
  state: string;
  street: string;
};

const schema = yup.object().shape({
  cep: yup.string().required('Informe o campo CEP'),
  number: yup.string().required('Informe o campo número'),
  district: yup.string().required('Informe o campo número'),
  country: yup.string().required('Informe o campo número'),
  state: yup.string().required('Informe o campo número'),
  street: yup.string().required('Informe o campo número'),
});

function RegisterCustomerAddress(): JSX.Element {
  const navigate = useNavigate();
  const { createCustomerAddress } = useCustomers();
  const { customer_id } = useParams();

  const [isResultVisible, setIsResultVisible] = useState(false);

  const { handleSubmit, control, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async ({ cep, number, district, country, state, street }: FormData) => {
      try {
        if (!customer_id) throw Error();
        await createCustomerAddress({
          user_id: customer_id,
          cep,
          number,
          district,
          country,
          state,
          street,
        });

        message.success('produto criado com sucesso');

        reset();
        setIsResultVisible(true);
      } catch (error) {
        message.error('Falha na criação do produto');
      }
    },
    [createCustomerAddress, reset, setIsResultVisible, customer_id],
  );

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      {isResultVisible ? (
        <Result
          status="success"
          title="Endereço do cliente foi cadastrado com sucesso"
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => navigate('/dashboard')}
            >
              Voltar ao ínicio
            </Button>,
          ]}
        />
      ) : (
        <>
          <PageHeader title="Voltar" onBack={() => navigate('/dashboard')} />

          <Row justify="center">
            <Content style={{ maxWidth: 680 }}>
              <Title level={3}>Cadastrar endereço do cliente</Title>
              <Form
                layout="vertical"
                onSubmitCapture={handleSubmit(onSubmit)}
                style={{ paddingBottom: 30 }}
              >
                <Col span={24}>
                  <Controller
                    name="cep"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['cep']}
                        label="CEP"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <Input size="large" onChange={onChange} value={value} />
                      </Form.Item>
                    )}
                  />
                  <Row justify="center" gutter={30}>
                    <Col span={18}>
                      <Controller
                        name="street"
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Form.Item
                            name={['street']}
                            label="Rua"
                            validateStatus={error?.message && 'error'}
                            hasFeedback
                            help={error?.message}
                          >
                            <Input
                              size="large"
                              onChange={onChange}
                              value={value}
                            />
                          </Form.Item>
                        )}
                      />
                    </Col>

                    <Col span={6}>
                      <Controller
                        name="number"
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Form.Item
                            name={['number']}
                            label="Número"
                            validateStatus={error?.message && 'error'}
                            hasFeedback
                            help={error?.message}
                          >
                            <Input
                              size="large"
                              onChange={onChange}
                              value={value}
                            />
                          </Form.Item>
                        )}
                      />
                    </Col>
                  </Row>

                  <Controller
                    name="district"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['district']}
                        label="Bairro"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <Input size="large" onChange={onChange} value={value} />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="state"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['state']}
                        label="Estado"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <Input size="large" onChange={onChange} value={value} />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="country"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['country']}
                        label="País"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <Input size="large" onChange={onChange} value={value} />
                      </Form.Item>
                    )}
                  />
                </Col>
                <Row gutter={30} style={{ marginTop: 30 }}>
                  <Col span={12}>
                    <Button type="primary" block size="large" htmlType="submit">
                      Submit
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

export default RegisterCustomerAddress;
