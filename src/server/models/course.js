module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("Course", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'courses'
    })

    Course.associate = (models) => {
        Course.hasMany(models.Class, {
            foreignKey: {
                name: 'courseId',
                allowNull: false,
            }
        })
        Course.belongsTo(models.Teacher, {
            foreignKey: {
                name: 'teacherId',
                allowNull: false,
            }
        })
    }
    return Course
}
