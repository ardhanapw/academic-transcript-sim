module.exports = (sequelize, DataTypes) => {
    const ConvertedScore = sequelize.define("ConvertedScore", {
        nim: {
            type: DataTypes.INTEGER,
            references: {
                model: 'students',
                key: 'nim'
            }
        },
        kode_matkul: {
            type: DataTypes.STRING,
            references: {
                model: 'courses',
                key: 'kode_matkul'
            }
        },
        konversi_nilai: {
            type: DataTypes.FLOAT,
            allowNull: false, 
            validate: {
                notEmpty: true
            }
        },
    })

    return ConvertedScore
}