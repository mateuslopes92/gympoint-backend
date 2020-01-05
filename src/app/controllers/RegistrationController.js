import { addMonths, parseISO, startOfDay, isBefore, endOfDay } from 'date-fns';
import * as Yup from 'yup';
import Plan from '../models/Plan';
import Registration from '../models/Registration';
import Student from '../models/Student';

class RegistrationController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const registrations = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

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

    const startDate = endOfDay(parseISO(start_date));

    if (isBefore(startDate, new Date())) {
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
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

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

    if (registration.canceled_at !== null) {
      return res
        .status(400)
        .json({ error: 'This registration is already canceled' });
    }

    if (isBefore(registration.end_date, new Date())) {
      return res
        .status(400)
        .json({ error: "You can't cancel an inactive registration" });
    }

    registration.canceled_at = new Date();

    await registration.save();

    return res.json(registration);
  }
}

export default new RegistrationController();
