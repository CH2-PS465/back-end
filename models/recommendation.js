const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/config');

class Recommendation extends Model {
  static async getRecommendationById(id) {
    try {
      const result = await Recommendation.findByPk(id);

      if (result) {
        return result;
      } else {
        console.log(`No recommendation found with id ${id}.`);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving recommendation by ID:', error.message);
      throw new Error('Failed to retrieve recommendation by ID');
    }
  }

  static async saveRecommendation(peruntukan, fase, banyak, recommendation) {
    try {
      await Recommendation.create({
        peruntukan,
        fase,
        banyak,
        recommendation,
      });
      console.log('Recommendation saved to the database.');
    } catch (error) {
      console.error('Error saving recommendation to the database:', error.message);
      throw new Error('Failed to save recommendation to the database');
    }
  }

  static async deleteRecommendationById(id) {
    try {
      const deletedRows = await Recommendation.destroy({
        where: { id: id },
      });

      if (deletedRows > 0) {
        console.log(`Recommendation with id ${id} deleted successfully.`);
        return true;
      } else {
        console.log(`No recommendation found with id ${id}.`);
        return false;
      }
    } catch (error) {
      console.error('Error deleting recommendation from the database:', error.message);
      throw new Error('Failed to delete recommendation from the database');
    }
  }
  
  static async updateRecommendation(id, peruntukan, fase, banyak, recommendation) {
    try {
      const result = await Recommendation.findByPk(id);
  
      if (result) {
        result.peruntukan = peruntukan;
        result.fase = fase;
        result.banyak = banyak;
        result.recommendation = recommendation;
  
        await result.save();
  
        console.log(`Recommendation with id ${id} updated successfully.`);
        return result;
      } else {
        console.log(`No recommendation found with id ${id}.`);
        return null;
      }
    } catch (error) {
      console.error('Error updating recommendation in the database:', error.message);
      throw new Error('Failed to update recommendation in the database');
    }
  }

  static async getRecommendation(peruntukan, fase, banyak) {
    try {
      const result = await Recommendation.findOne({
        where: { peruntukan, fase, banyak },
      });

      if (result) {
        const recommendationValue = result.recommendation;
        console.log('Recommendation Value:', recommendationValue);
        return recommendationValue;
      } else {
        console.log('No recommendation found for the given criteria.');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving recommendation from the database:', error.message);
      throw new Error('Failed to retrieve recommendation from the database');
    }
  }
}

Recommendation.init(
  {
    peruntukan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fase: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    banyak: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recommendation: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Recommendation',
  }
);

function ayam_petelur(fase, banyak) {
  let recommendationContent = '';
  if (fase === "1") {  // fase starter
    recommendationContent = `Ternak anda berada pada fase starter, komposisi pakan yang sebaiknya anda berikan:\n
          Jagung: ${(72.4 / 100 * 40 * banyak).toFixed(2)} gram\n
          Tepung ikan: ${(18.4 / 100 * 40 * banyak).toFixed(2)} gram\n
          Kedelai/ampas tahu: ${(9.2 / 100 * 40 * banyak).toFixed(2)} gram`;
  } else if (fase === "2") {  // fase grower
    recommendationContent = `Ternak anda berada pada fase grower, komposisi pakan yang sebaiknya anda berikan:\n
          Jagung: ${(76.9 / 100 * 80 * banyak).toFixed(2)} gram\n
          Tepung ikan: ${(15.4 / 100 * 80 * banyak).toFixed(2)} gram\n
          Kedelai/ampas tahu: ${(7.7 / 100 * 80 * banyak).toFixed(2)} gram`;
  } else if (fase === "3") {  // fase layers
    recommendationContent = `Ternak anda berada pada fase layers, komposisi pakan yang sebaiknya anda berikan:\n
          Jagung: ${(81.5 / 100 * 120 * banyak).toFixed(2)} gram\n
          Tepung ikan: ${(12.3 / 100 * 120 * banyak).toFixed(2)} gram\n
          Kedelai/ampas tahu: ${(6.2 / 100 * 120 * banyak).toFixed(2)} gram`;
  } else {
    return { error: "Masukkan anda harus berupa angka 1, 2, atau 3 pada kolom 'Fase Ternak'." };
  }

  Recommendation.saveRecommendation("ayam_petelur", fase, banyak, recommendationContent);

  return {
    recommendation: recommendationContent
  };
}

function ayam_pedaging(fase, banyak) {
  let recommendationContent = '';

  if (fase === "1") {  // fase starter
    recommendationContent = `Ternak anda berada pada fase starter, komposisi pakan yang sebaiknya anda berikan:\n
          Jagung: ${(53.6 / 100 * 50 * banyak).toFixed(2)} gram\n
          Bungkil kedelai: ${(35.64 / 100 * 50 * banyak).toFixed(2)} gram\n
          Tepung tulang: ${(5 / 100 * 50 * banyak).toFixed(2)} gram\n
          Bubuk lemak: ${(3.1 / 100 * 50 * banyak).toFixed(2)} gram\n
          Fosfor dan kalsium: ${(0.44 / 100 * 50 * banyak).toFixed(2)} gram\n
          Asam amino: ${(1.6 / 100 * 50 * banyak).toFixed(2)} gram\n
          Tepung Batu: ${(0.62 / 100 * 50 * banyak).toFixed(2)} gram`;
  } else if (fase === "2") {  // fase finisher
    recommendationContent = `Ternak anda berada pada fase finisher, komposisi pakan yang sebaiknya anda berikan:\n
          Jagung: ${(62.5 / 100 * 120 * banyak).toFixed(2)} gram\n
          Bungkil kedelai: ${(29.2 / 100 * 120 * banyak).toFixed(2)} gram\n
          Tepung tulang: ${(5 / 100 * 120 * banyak).toFixed(2)} gram\n
          Bubuk lemak: ${(1.2 / 100 * 120 * banyak).toFixed(2)} gram\n
          Fosfor dan kalsium: ${(0.5 / 100 * 120 * banyak).toFixed(2)} gram\n
          Asam amino: ${(1.3 / 100 * 120 * banyak).toFixed(2)} gram\n
          Tepung Batu: ${(0.4 / 100 * 120 * banyak).toFixed(2)} gram`;
  } else {
    return { error: "Masukkan anda harus berupa angka 1, 2, atau 3 pada kolom 'Fase Ternak'." };
  }

  Recommendation.saveRecommendation("ayam_pedaging", fase, banyak, recommendationContent);

  return {
    recommendation: recommendationContent
  };
}

module.exports = { ayam_petelur, ayam_pedaging, Recommendation };