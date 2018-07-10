import BaseStats from "./BaseStats";
import OptimizationPlan from "./OptimizationPlan";

class Character {
  constructor(name,
              baseID,
              level,
              starLevel,
              gearLevel,
              gearPieces,
              galacticPower,
              physDmgPct,
              baseStats,
              totalStats,
              optimizationPlan,
              tags,
              extraTags,
              useOnly5DotMods
  ) {
    this.name = name;
    this.baseID = baseID;
    this.level = level;
    this.starLevel = starLevel;
    this.gearLevel = gearLevel;
    this.gearPieces = gearPieces;
    this.galacticPower = galacticPower;
    this.physDmgPct = physDmgPct;
    this.baseStats = baseStats;
    this.totalStats = totalStats;
    this.optimizationPlan = optimizationPlan;
    this.tags = tags;
    this.extraTags = extraTags;
    this.useOnly5DotMods = useOnly5DotMods || false;
  }

  /**
   * Checks whether this character matches a given filter string in name or tags
   * @param filterString string The string to filter by
   * @returns boolean
   */
  matchesFilter(filterString) {
    return this.name.toLowerCase().includes(filterString) ||
      (this.tags || []).concat(this.extraTags || []).some(tag => tag.toLowerCase().includes(filterString))
  }

  /**
   * Apply any variable properties (level, starLevel, etc) from other to this character
   * @param other Character
   */
  apply(other) {
    this.level = other.level;
    this.starLevel = other.starLevel;
    this.gearLevel = other.gearLevel;
    this.gearPieces = other.gearPieces;
    this.galacticPower = other.galacticPower;
    this.optimizationPlan = other.optimizationPlan;
    this.useOnly5DotMods = other.useOnly5DotMods;
  }

  serialize() {
    let characterObject = {};

    characterObject.name = this.name;
    characterObject.baseID = this.baseID;
    characterObject.level = this.level;
    characterObject.starLevel = this.starLevel;
    characterObject.gearLevel = this.gearLevel;
    characterObject.gearPieces = this.gearPieces;
    characterObject.galacticPower = this.galacticPower;
    characterObject.physDmgPercent = this.physDmgPct;
    characterObject.baseStats = this.baseStats;
    characterObject.totalStats = this.totalStats;
    characterObject.optimizationPlan = this.optimizationPlan.serialize();
    characterObject.useOnly5DotMods = this.useOnly5DotMods;

    return characterObject;
  }

  static deserialize(characterJson) {
    return new Character(
      characterJson.name,
      '',
      characterJson.level,
      characterJson.starLevel || 1,
      characterJson.gearLevel || 1,
      characterJson.gearPieces || [],
      characterJson.galacticPower || 0,
      characterJson.physDmgPercent,
      characterJson.baseStats ? BaseStats.deserialize(characterJson.baseStats) : new BaseStats() ,
      characterJson.totalStats ? BaseStats.deserialize(characterJson.totalStats) : new BaseStats() ,
      OptimizationPlan.deserialize(characterJson.optimizationPlan),
      [],
      [],
      characterJson.useOnly5DotMods
    );
  }
}

class BasicCharacter extends Character {
  constructor(name, baseID, physDmgPct, defaultPlan, tags, extraTags, useOnly5dotMods) {
    super(
      name,
      baseID,
      1,
      1,
      1,
      [],
      0,
      physDmgPct,
      new BaseStats(),
      new BaseStats(),
      defaultPlan,
      tags,
      extraTags,
      useOnly5dotMods
    );
  }
}

const DamageType = {
  'physical': 1,
  'special': 0,
  'mixed': .5
};

Object.freeze(DamageType);

export default Character;

export {BasicCharacter, DamageType};
