module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("Student", {
        nim: {
            type: DataTypes.INTEGER,
            primaryKey: true,
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
        ipk: {
            type: DataTypes.STRING,
            allowNull: true
        },
        digital_sign: {
            type: DataTypes.STRING(3000),
            allowNull: true
        }
    })

    return Student
}