import Sequelize from 'sequelize';
import Mongoose from 'mongoose';

import databaseConfig from '../config/database';
import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Register from '../app/models/Register';
import File from '../app/models/File';
import HelpOrder from '../app/models/HelpOrder';

const models = [User, Student, Plan, Register, File, HelpOrder];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnections = Mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
