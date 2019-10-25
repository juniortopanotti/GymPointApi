import { differenceInCalendarDays } from 'date-fns';
import Checkin from '../schemas/Checkin';

class CheckinController {
  async store(req, res) {
    const { id } = req.student;

    const checkins = await Checkin.find({
      student: id,
      currentPeriod: true,
    }).sort({
      createdAt: 'asc',
    });

    if (checkins.length > 0) {
      const firstPeriodCheckin = checkins[0];
      const daysPeriod = differenceInCalendarDays(
        new Date(),
        firstPeriodCheckin.createdAt
      );

      if (daysPeriod <= 7 && checkins.length >= 5) {
        return res.status(400).json({
          error: 'You have exceeded 5 checkins limit in 7 days.',
        });
      }

      if (daysPeriod > 7) {
        await Checkin.updateMany(
          {
            currentPeriod: true,
          },
          {
            currentPeriod: false,
          }
        );
      }
    }

    const checkin = await Checkin.create({
      student: id,
    });

    return res.json(checkin);
  }

  async index(req, res) {
    const { id } = req.student;

    const chekins = await Checkin.find({
      student: id,
    })
      .sort({
        createdAt: 'desc',
      })
      .limit(7);

    return res.json(chekins);
  }
}

export default new CheckinController();
