import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrderAnswerMail {
  get key() {
    return 'HelpOrderAnswerMail';
  }

  async handle({ data }) {
    const { help_order, student } = data;

    await Mail.senddMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Pedido de auxilio respondido',
      template: 'helporder',
      context: {
        question: help_order.question,
        created_at: format(
          parseISO(help_order.createdAt),
          "'dia' dd 'de' MMMM 'de' yyyy",
          { locale: pt }
        ),
        answer: help_order.answer,
        answer_at: format(
          parseISO(help_order.answer_at),
          "'dia' dd 'de' MMMM 'de' yyyy",
          { locale: pt }
        ),
      },
    });
  }
}

export default new HelpOrderAnswerMail();
