import CombatLogParser from './CombatLogParser';
import Entity from './Entity';

interface PetInfo {
  name: string;
  type: string;
  guid: number;
}

class Pet extends Entity {
  get name() {
    return this._baseInfo.name;
  }

  get type() {
    return this._baseInfo.type;
  }

  get guid() {
    return this._baseInfo.guid;
  }

  _baseInfo: PetInfo;

  constructor(owner: CombatLogParser, baseInfo: PetInfo) {
    super(owner);
    this._baseInfo = baseInfo;
  }
}

export default Pet;
