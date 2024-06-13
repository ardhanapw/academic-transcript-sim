module.exports = (sequelize, DataTypes) => {
    const Score = sequelize.define("Score", {
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
        nilai: {
            type: DataTypes.STRING,
            allowNull: false, 
            validate: {
                notEmpty: true
            }
        },
    })

    return Score
}
