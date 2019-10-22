import { Model, Sequelize } from 'sequelize';
import { isBefore } from 'date-fns';

class Register extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.REAL,
        canceled_at: Sequelize.DATE,
        expired: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.end_date, new Date());
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}

export default Register;
