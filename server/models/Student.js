module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("Student", {
        nim: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            validate: {
                notEmpty: true
            }
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false, 
            validate: {
                notEmpty: true
            }
        },
        digital_sign: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })

    return Student
}