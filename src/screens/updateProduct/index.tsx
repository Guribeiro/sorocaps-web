import { useCallback, useMemo, useState } from 'react';
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
  Modal,
  Empty,
  Space,
  Select,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { DeleteOutlined } from '@ant-design/icons';
import { ProductState, useProducts } from '../../hooks/products';

const { Content } = Layout;
const { Title, Paragraph } = Typography;
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
});

function UpdateProduct(): JSX.Element {
  const navigate = useNavigate();
  const { remove, update } = useProducts();
  const { products } = useProducts();
  const { product_id } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const product = useMemo(() => {
    const findProduct = products.find(p => p.id === product_id);

    if (!findProduct) {
      return {} as ProductState;
    }

    return findProduct;
  }, [product_id, products]);

  const { handleSubmit, control, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      bar_code: product.bar_code,
      title: product.title,
      description: product.description,
      unit_of_measurement: product.unit_of_measurement,
      quantity_in_units: product.quantity_in_units,
      buy_price: product.buy_price,
      sale_price: product.sale_price,
    },
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
    }: FormData) => {
      try {
        await update({
          product_id: product.id,
          bar_code,
          title,
          description,
          quantity_in_units,
          unit_of_measurement,
          buy_price,
          sale_price,
        });

        message.success('produto atualizado com sucesso');

        reset();
        navigate('/dashboard');
      } catch (error) {
        message.error('Falha na atualização do produto');
      }
    },
    [reset, navigate, update, product.id],
  );

  const handleRemoveProduct = useCallback(async () => {
    try {
      if (!product) return;

      await remove({ product_id: product.id });

      message.success('produto excluído com sucesso');
      navigate('/dashboard');

      setIsModalVisible(false);
    } catch (error) {
      message.error('Erro ao excluir Endereço');
      setIsModalVisible(false);
    } finally {
      setRemoveLoading(false);
    }
  }, [navigate, remove, product]);

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <PageHeader title="Voltar" onBack={() => navigate('/dashboard')} />

      <Modal
        title="Deseja mesmo excluir esse usuário?"
        onCancel={() => setIsModalVisible(false)}
        visible={isModalVisible}
        onOk={handleRemoveProduct}
        confirmLoading={removeLoading}
      >
        <Paragraph>
          Os dados desse usuário não poderão ser recuperados
        </Paragraph>
      </Modal>

      {!product.id ? (
        <Empty />
      ) : (
        <Row justify="center">
          <Content style={{ maxWidth: 680 }}>
            <Row>
              <Col span={20}>
                <Title level={3}>Atualizar dados do produto</Title>
              </Col>
            </Row>
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
                      initialValue={value}
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
                      initialValue={value}
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
                      initialValue={value}
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
                      initialValue={[value]}
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
                      initialValue={value}
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
                          initialValue={value}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            stringMode
                            precision={2}
                            size="large"
                            formatter={v =>
                              `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            onChange={onChange}
                            value={value}
                            defaultValue={value}
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
                          initialValue={value}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            stringMode
                            precision={2}
                            size="large"
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
                </Row>
              </Col>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: '100%' }}
              >
                <Button type="primary" block size="large" htmlType="submit">
                  Atualizar
                </Button>
                <Button
                  type="primary"
                  danger
                  block
                  size="large"
                  htmlType="button"
                  onClick={() => setIsModalVisible(true)}
                >
                  Excluir produto
                  <DeleteOutlined />
                </Button>
              </Space>
            </Form>
          </Content>
        </Row>
      )}
    </Layout>
  );
}

export default UpdateProduct;
