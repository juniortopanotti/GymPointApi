import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegisterMail {
  get key() {
    return 'RegisterMail';
  }

  async handle({ data }) {
    const { student, plan, registerPrice, endDate } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Welcome to GymPoint!',
      template: 'new-register',
      context: {
        name: student.name,
        title: plan.title,
        endDate: format(parseISO(endDate), "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        price: registerPrice,
      },
    });
  }
}

export default new RegisterMail();
