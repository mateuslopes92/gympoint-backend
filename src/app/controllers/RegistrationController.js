import Plan from '../models/Plan';
import Registration from '../models/Registration';
import Student from '../models/Student';

class RegistrationController {
  async store(req, res){
    const { student_id, plan_id, start_date } = req.body;

    console.log(start_date);

    const checkStudentExists = await Student.findOne({
      where: { id: student_id }
    });

    if (!checkStudentExists) {
      return res.status(404).json({error: "Student not found."});
    }

    const checkPlanExists = await Plan.findOne({
      where: { id: plan_id }
    });

    if (!checkPlanExists) {
      return res.status(404).json({error: "Plan not found."});
    }

    return res.json({ok: true});
  }
}

export default new RegistrationController();
