module.exports = (sequelize, DataTypes) => {
    // feedback model
    const Feedback = sequelize.define("Feedback", {
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["text", "emoji"]] // only allow text or emoji
            }
        },
        isUnread: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true // default to true
        },
        like: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        isEdited: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'feedbacks'
    })
    // associate feedback with responses
    Feedback.associate = (models) => {
        Feedback.belongsTo(models.Response, {
            foreignKey: {
                name: 'responseId',
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    }

    return Feedback
}