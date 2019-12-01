import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class StudentHelpOrderController {
  async store(req, res) {
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
