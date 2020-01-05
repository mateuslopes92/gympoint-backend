import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import Student from '../models/Student';
import authConfig from '../../config/auth';

class StudentController {
  async index(req, res) {
    const { q, page = 1 } = req.query;

    const students = await Student.findAll({
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
      where: {
        name: {
          [Op.like]: `%${q || ''}%`,
        },
      },
    });

    return res.json(students);
  }

  async read(req, res) {
    const { student_id } = req.params;

    const student = await Student.findOne({
      where: { id: student_id },
    });

    return res.json({
      student,
      token: jwt.sign({ student_id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .positive(),
      weight: Yup.number()
        .required()
        .positive(),
      height: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const checkExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (checkExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number()
        .integer()
        .positive(),
      weight: Yup.number().positive(),
      height: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    if (email && email !== student.email) {
      const studentExists = await Student.findOne({
        where: { email },
      });

      if (studentExists) {
        return res.status(400).json({ error: 'Student already exists' });
      }
    }
    const { name, age, weight, height } = await student.update(req.body);
    return res.json({
      name,
      email: student.email,
      age,
      weight,
      height,
    });
  }

  async delete(req, res) {
    const { student_id } = req.params;
    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    await student.destroy();

    return res.status(200).json({ ok: 'The Student has been deleted' });
  }
}

export default new StudentController();
