import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class AdmHelpOrderController {
  async index(req, res) {
    const help_orders = await HelpOrder.findAll({ where: { answer: null } });

    return res.json(help_orders);
  }
}

export default new AdmHelpOrderController();
