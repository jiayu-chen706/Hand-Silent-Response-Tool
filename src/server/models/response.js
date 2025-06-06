module.exports = (sequelize, DataTypes) => {
    const Response = sequelize.define("Response", {
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isAnonymous: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        isUnread: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        isEdited: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'responses'
    })

    Response.associate = (models) => {
        Response.hasMany(models.Feedback, {
            foreignKey: {
                name: 'responseId',
                allowNull: false,
            }
        })
        Response.belongsTo(models.Student, {
            foreignKey: {
                name: 'studentId',
                allowNull: false,
            }
        })
        Response.belongsTo(models.Class, {
            foreignKey: {
                name: 'classId',
                allowNull: false,
            }
        })
    }
    return Response
}
