module.exports = (sequelize, DataTypes) => {
    const Teacher = sequelize.define("Teacher", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'teachers'
    })

    Teacher.associate = (models) => {
        Teacher.hasMany(models.Course, {
            foreignKey: {
                name: 'teacherId',
                allowNull: false,
            }
        })
    }
    return Teacher
}
