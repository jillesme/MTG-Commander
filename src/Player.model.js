import { observable, action, computed } from 'mobx';

export default class Player {
  id;
  name = '';
  @observable life = 40;
  @observable commanderDamage = observable.map({});

  constructor(id, name, life) {
    this.id = id;
    this.name = name;

    // Only used when reloading game state
    if (typeof life !== 'undefined') this.life = life;
  }

  @action modifyLife(amount, isLifeGain) {
    if (isLifeGain) {
      this.life += amount;
    } else {
      this.life -= amount;
    }
  }

  @action increaseCommanderDamage(fromPlayer, amount) {
    this.life -= amount;
    const currentDamage = this.commanderDamage.get(fromPlayer);
    this.commanderDamage.set(fromPlayer, currentDamage + amount);
  }

  @computed get isDead() {
    return this.life === 0 || this.commanderDamage.values().some(damage => damage >= 21);
  }
}
