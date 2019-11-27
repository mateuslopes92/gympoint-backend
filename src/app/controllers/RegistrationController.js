import { addMonths, parseISO, startOfDay, isBefore, endOfDay } from 'date-fns';
import Plan from '../models/Plan';
import Registration from '../models/Registration';
import Student from '../models/Student';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll();

    return res.json(registrations);
  }

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

  async update(req, res) {
    const { registration_id } = req.params;
    const { student_id, plan_id, start_date } = req.body;

    const registration = await Registration.findByPk(registration_id);

    if (!registration) {
      return res.status(400).json({ error: 'Registration not found.' });
    }

    const plan = await Plan.findOne({
      where: { id: plan_id },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    const { duration, price } = plan;

    const student = await Student.findOne({
      where: { id: student_id },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const startDate = startOfDay(parseISO(start_date));
    const endDate = startOfDay(addMonths(startDate, duration));

    if (start_date) {
      if (isBefore(endOfDay(startDate), new Date())) {
        return res.status(400).json({ error: 'Past dates are not permited.' });
      }
    }

    await registration.update({
      student_id,
      plan_id,
      start_date: startOfDay(startDate),
      end_date: endDate,
      price: duration * price,
    });

    return res.json(registration);
  }

  async delete(req, res) {
    const { registration_id } = req.params;

    const registration = await Registration.findByPk(registration_id);

    if (!registration) {
      return res.status(400).json({ error: 'Registration not found.' });
    }

    await registration.destroy();

    return res.json({ ok: true });
  }
}

export default new RegistrationController();
