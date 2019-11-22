import { addMonths, parseISO, startOfDay, isBefore, endOfDay } from 'date-fns';
import Plan from '../models/Plan';
import Registration from '../models/Registration';
import Student from '../models/Student';

class RegistrationController {
  async store(req, res) {
    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findOne({
      where: { id: student_id },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const plan = await Plan.findOne({
      where: { id: plan_id },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    const { duration, price } = plan;

    const startDate = startOfDay(parseISO(start_date));

    if (isBefore(endOfDay(startDate), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited.' });
    }

    const endDate = startOfDay(addMonths(startDate, duration));

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date: startOfDay(startDate),
      end_date: endDate,
      price: duration * price,
    });

    return res.json(registration);
  }
}

export default new RegistrationController();
