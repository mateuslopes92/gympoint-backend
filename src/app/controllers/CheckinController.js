import * as Yup from 'yup';
import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    return res.json({ ok: true });
  }

  async index(req, res) {
    return res.json({ ok: true });
  }

  async show(req, res) {
    return res.json({ ok: true });
  }

  async update(req, res) {
    return res.json({ ok: true });
  }

  async delete(req, res) {
    return res.json({ ok: true });
  }
}

export default new CheckinController();
