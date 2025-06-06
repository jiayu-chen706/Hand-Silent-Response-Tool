module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("Student", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        studentID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'students'
    })

    Student.associate = (models) => {
        Student.hasMany(models.Response, {
            foreignKey: {
                name: 'studentId',
                allowNull: false,
            }
        });
        Student.belongsTo(models.Class, {
            foreignKey: {
                name: 'classId',
                allowNull: true,
            }
        });
    }
    return Student
}
