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
  InputNumber,
  message,
  Result,
  Select,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useProducts } from '../../hooks/products';
import './styles.css';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

type FormData = {
  bar_code: string;
  title: string;
  description: string;
  quantity_in_units: number;
  unit_of_measurement: string;
  buy_price: number;
  sale_price: number;
  amount: number;
  limit: number;
};

const schema = yup.object().shape({
  bar_code: yup.string().required('Informe o código de barras do produto'),
  title: yup.string().required('Informe o nome do produto'),
  description: yup.string().required('Informe a descrição do produto'),
  quantity_in_units: yup
    .number()
    .required('Informe o total em unidades')
    .positive()
    .min(1, 'Unidade não pode ser menor do que 01'),
  unit_of_measurement: yup
    .string()
    .required('Informe a unidade de medida do produto'),
  buy_price: yup
    .number()
    .positive('Informe apenas valores positivos')
    .required('Informe o valor de compra do produto'),
  sale_price: yup
    .number()
    .positive()
    .moreThan(
      yup.ref('buy_price'),
      'Valor de venda deve ser maior do que o valor de compra',
    )
    .required('Informe o valor de venda do produto'),
  amount: yup
    .number()
    .positive('Campo inválido')
    .required('Informe a quantidade desse produto em estoque'),
  limit: yup
    .number()
    .positive('Campo inválido')
    .moreThan(
      yup.ref('amount'),
      'Limite em estoque deve ser maior do que a quantidade definidade',
    )
    .required('Informe o limite permitido desse produto em estoque'),
});

function RegisterProduct(): JSX.Element {
  const navigate = useNavigate();
  const { create } = useProducts();

  const [isResultVisible, setIsResultVisible] = useState(false);

  const { handleSubmit, control, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async ({
      bar_code,
      title,
      description,
      quantity_in_units,
      unit_of_measurement,
      buy_price,
      sale_price,
      amount,
      limit,
    }: FormData) => {
      try {
        await create({
          bar_code,
          title,
          description,
          quantity_in_units,
          unit_of_measurement,
          buy_price,
          sale_price,
          amount,
          limit,
        });
        message.success('produto cadastrado com sucesso');

        reset();
        setIsResultVisible(true);
      } catch (error) {
        message.error('Falha na criação do produto');
      }
    },
    [create, reset],
  );

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      {isResultVisible ? (
        <Result
          status="success"
          title="Produto cadastrado com sucesso"
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => navigate('/dashboard')}
            >
              Voltar ao ínicio
            </Button>,
            <Button key="buy" onClick={() => setIsResultVisible(false)}>
              Cadastrar novo produto
            </Button>,
          ]}
        />
      ) : (
        <>
          <PageHeader title="Voltar" onBack={() => navigate('/dashboard')} />

          <Row justify="center">
            <Content style={{ maxWidth: 680, flexDirection: 'column' }}>
              <Title level={3}>Cadastrar novo produto</Title>

              <Form
                layout="vertical"
                onSubmitCapture={handleSubmit(onSubmit)}
                style={{ paddingBottom: 30 }}
              >
                <Col span={24}>
                  <Controller
                    name="bar_code"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['bar_code']}
                        label="Código de barras"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <Input
                          size="large"
                          placeholder="Ex. 0608473184014"
                          onChange={onChange}
                          value={value}
                        />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="title"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['title']}
                        label="Nome do produto"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <Input
                          size="large"
                          placeholder="Ex. Suplemento alimentar de melatonina"
                          onChange={onChange}
                          value={value}
                        />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="description"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['description']}
                        label="Descrição do produto"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <TextArea
                          size="large"
                          placeholder="Ex. Suplemento alimentar de melatonina"
                          onChange={onChange}
                          value={value}
                        />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="unit_of_measurement"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['unit_of_measurement']}
                        label="Unidade de medida"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                        initialValue={value}
                      >
                        <Select
                          showSearch
                          style={{ width: '100%' }}
                          size="large"
                          placeholder="Search to Select"
                          onChange={onChange}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option!.children as unknown as string).includes(
                              input,
                            )
                          }
                          filterSort={(optionA, optionB) =>
                            (optionA!.children as unknown as string)
                              .toLowerCase()
                              .localeCompare(
                                (
                                  optionB!.children as unknown as string
                                ).toLowerCase(),
                              )
                          }
                        >
                          <Option value="Caixa">Caixa</Option>
                          <Option value="Peças">Peça</Option>
                          <Option value="Saco">Saco</Option>
                          <Option value="Garrafa">Garrafa</Option>
                          <Option value="Metro">Metro</Option>
                          <Option value="Gramas">Gramas</Option>
                        </Select>
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="quantity_in_units"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Form.Item
                        name={['quantity_in_units']}
                        label="Unidades por unidade de medida"
                        validateStatus={error?.message && 'error'}
                        hasFeedback
                        help={error?.message}
                      >
                        <InputNumber
                          size="large"
                          placeholder="0"
                          min={0}
                          onChange={onChange}
                          value={value}
                        />
                      </Form.Item>
                    )}
                  />

                  <Row justify="center" gutter={30}>
                    <Col span={12}>
                      <Controller
                        name="buy_price"
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Form.Item
                            name={['buy_price']}
                            label="Valor de compra"
                            validateStatus={error?.message && 'error'}
                            hasFeedback
                            help={error?.message}
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              stringMode
                              precision={2}
                              size="large"
                              placeholder="0"
                              formatter={v =>
                                `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                              onChange={onChange}
                              value={value}
                            />
                          </Form.Item>
                        )}
                      />
                    </Col>
                    <Col span={12}>
                      <Controller
                        name="sale_price"
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Form.Item
                            name={['sale_price']}
                            label="Valor de venda"
                            validateStatus={error?.message && 'error'}
                            hasFeedback
                            help={error?.message}
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              stringMode
                              precision={2}
                              size="large"
                              placeholder="0"
                              formatter={v =>
                                `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                              onChange={onChange}
                              value={value}
                            />
                          </Form.Item>
                        )}
                      />
                    </Col>
                    <Col span={12}>
                      <Controller
                        name="amount"
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Form.Item
                            name={['amount']}
                            label="Quantidade"
                            validateStatus={error?.message && 'error'}
                            hasFeedback
                            help={error?.message}
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              stringMode
                              size="large"
                              placeholder="0"
                              onChange={onChange}
                              value={value}
                            />
                          </Form.Item>
                        )}
                      />
                    </Col>
                    <Col span={12}>
                      <Controller
                        name="limit"
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Form.Item
                            name={['limit']}
                            label="Limite"
                            validateStatus={error?.message && 'error'}
                            hasFeedback
                            help={error?.message}
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              stringMode
                              size="large"
                              placeholder="0"
                              onChange={onChange}
                              value={value}
                            />
                          </Form.Item>
                        )}
                      />
                    </Col>
                  </Row>
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
                      onClick={() => reset({})}
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

export default RegisterProduct;
