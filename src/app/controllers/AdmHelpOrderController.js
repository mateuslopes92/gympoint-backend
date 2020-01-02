import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import Queue from '../../lib/Queue';
import HelpOrderAnswerMail from '../jobs/HelpOrderAnswerMail';

class AdmHelpOrderController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const help_orders = await HelpOrder.findAll({
      where: { answer: null },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(help_orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { help_order_id } = req.params;
    const { answer } = req.body;

    const help_order = await HelpOrder.findByPk(help_order_id);

    const student = await Student.findByPk(help_order.student_id);

    if (!help_order) {
      return res.status(400).json({ error: 'Help Order not found.' });
    }

    if (!answer) {
      return res
        .status(400)
        .json({ error: 'Please insert answer for help order.' });
    }

    await help_order.update({ answer, answer_at: new Date() });

    await Queue.add(HelpOrderAnswerMail.key, {
      student,
      help_order,
    });

    return res.json(help_order);
  }
}

export default new AdmHelpOrderController();
