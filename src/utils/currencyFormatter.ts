const currencyFormatter = (value: number): string => {
  const amount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100);

  return amount;
};

export default currencyFormatter;
