module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("Course", {
        kode_matkul: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false, 
            validate: {
                notEmpty: true
            }
        },
        nama_matkul: {
            type: DataTypes.STRING,
            allowNull: false, 
            validate: {
                notEmpty: true
            }
        },
        sks: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            validate: {
                notEmpty: true
            }
        },
    })

    return Course
}