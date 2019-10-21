import Sequelize, { Model } from 'sequelize';
import { differenceInYears } from 'date-fns';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        birth_date: Sequelize.DATE,
        weight: Sequelize.DECIMAL,
        height: Sequelize.DECIMAL,
        age: {
          type: Sequelize.VIRTUAL,
          get() {
            return differenceInYears(new Date(), this.birth_date);
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Student;
