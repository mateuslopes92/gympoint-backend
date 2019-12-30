import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class StudentHelpOrderController {
  async index(req, res) {
    const { student_id } = req.params;
    const { page = 1 } = req.query;

    const help_orders = await HelpOrder.findAll({
      where: { student_id },
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(help_orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id } = req.params;
    const { question } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const { id, created_at } = await HelpOrder.create({ student_id, question });

    return res.json({ id, student_id, question, created_at });
  }
}

export default new StudentHelpOrderController();
