import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const dateFormatter = (dateAsString: string) => {
  const date = new Date(dateAsString);

  return format(date, 'dd/MM/yyyy', {
    locale: ptBR,
  });
};

export default dateFormatter;
