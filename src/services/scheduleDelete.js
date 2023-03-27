const { Model } = require('sequelize');
const sequelize = require('sequelize');

class Schedule extends Model {
    // ...
}

Schedule.init({
    // ...
}, {
    sequelize,
    modelName: 'Schedule',
    hooks: {
        beforeBulkDelete: async (options) => {
            // Custom code to execute before bulk delete operation
            console.log('Before bulk delete');
        },
        afterBulkDelete: async (options) => {
            // Custom code to execute after bulk delete operation
            console.log('After bulk delete');
        }
    }
});

// Add custom methods to the model
Schedule.bulkDelete = async (where) => {
    return Schedule.destroy({ where });
}

module.exports = Schedule;
