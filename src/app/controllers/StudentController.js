import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .positive(),
      wheight: Yup.number()
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
    // const schema = Yup.object().shape({
    //   name: Yup.string(),
    //   email: Yup.string().email(),
    //   age: Yup.number()
    //     .integer()
    //     .positive(),
    //   wheight: Yup.number().positive(),
    //   height: Yup.number().positive(),
    // });
    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Validation fails' });
    // }
    // const { email } = req.body;
    // const userId = req.params;
    // console.log(userId);
    // const student = await Student.findByPk(parseFloat(userId));
    // if (email !== student.email) {
    //   const studentExists = await Student.findOne({
    //     where: { email },
    //   });
    //   if (studentExists) {
    //     return res.status(400).json({ error: 'Student already exists' });
    //   }
    // }
    // const { name, age, wheight, height } = await student.update(req.body);
    // return res.json({
    //   name,
    //   email,
    //   age,
    //   wheight,
    //   height,
    // });
  }
}

export default new StudentController();
