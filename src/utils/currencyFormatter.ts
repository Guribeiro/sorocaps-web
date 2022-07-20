const currencyFormatter = (value: number): string => {
  const amount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return amount;
};

export default currencyFormatter;
