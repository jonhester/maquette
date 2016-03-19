const model = (sequelize, DataTypes) => {
  const topic = sequelize.define('topic', {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    deviceId: DataTypes.STRING,
    value: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      },
    },
  });
  return topic;
};

export default model;
