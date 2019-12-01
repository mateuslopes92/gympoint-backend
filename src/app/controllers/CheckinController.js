// import * as Yup from 'yup';
import { subDays } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.json({ error: 'Student not found!' });
    }

    const litmitDate = subDays(new Date(), 7);
    const today = new Date();

    const checkins = await Checkin.findAll({
      where: {
        created_at: {
          [Op.between]: [litmitDate, today],
        },
      },
    });

    if (checkins.length > 5) {
      return res.json({ error: 'You can only do 5 checkins per week ' });
    }

    const checkin = await Checkin.create({ student_id });

    return res.json(checkin);
  }

  async index(req, res) {
    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.json({ error: 'Student not found!' });
    }

    const checkins = await Checkin.findAll({ where: { student_id } });

    return res.json(checkins);
  }
}

export default new CheckinController();
