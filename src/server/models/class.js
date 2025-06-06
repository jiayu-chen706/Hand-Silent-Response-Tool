module.exports = (sequelize, DataTypes) => {
    const Class = sequelize.define("Class", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        inviteCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        qrCode: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'classes'
    })

    Class.associate = (models) => {
        Class.hasMany(models.Response, {
            foreignKey: {
                name: 'classId',
                allowNull: false,
            }
        });
        Class.hasMany(models.Student, {
            foreignKey: {
                name: 'classId',
                allowNull: false,
            }
        });
        Class.belongsTo(models.Course, {
            foreignKey: {
                name: 'courseId',
                allowNull: false,
            }
        });
    }
    return Class;
}
