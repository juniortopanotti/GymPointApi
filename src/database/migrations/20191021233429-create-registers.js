module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('registers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      student_id: {
        type: Sequelize.INTEGER,
        references: { model: 'students', key: 'id' },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      plan_id: {
        type: Sequelize.INTEGER,
        references: { model: 'plans', key: 'id' },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      canceled_at: {
        type: Sequelize.DATE,
      },
      price: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('registers');
  },
};
