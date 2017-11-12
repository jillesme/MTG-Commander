import { observable, action, computed } from 'mobx';
import uuid from 'uuid/v4';

class Player {
  id = '';
  name = '';
  @observable life = 40;
  @observable commanderDamage = observable.map({});

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  @action increaseLife() {
    this.life += 1;
  }

  @action decreaseLife() {
    this.life -= 1;
  }

  @action increaseCommanderDamage(fromPlayer) {
    this.decreaseLife();
    this.commanderDamage.get(fromPlayer.id).damage += 1;
  }

  @computed get isDead() {
    return this.life === 0 || this.commanderDamage.values().some(player => player.damage >= 21);
  }
}

export default class GameStateStore {
  @observable playerMap = observable.map({});

  constructor(initialPlayers) {
    initialPlayers.forEach(this.addPlayer, this);
  }

  @action addPlayer(name) {
    const player = new Player(uuid(), name);

    const createDamageObject = target => ({ id: target.id, name: target.name, damage: 0 });
    // Set commander damage for all players and current player
    this.playerMap.forEach(existingPlayer => {
      existingPlayer.commanderDamage.set(player.id, createDamageObject(player));
      player.commanderDamage.set(existingPlayer.id, createDamageObject(existingPlayer));
    });

    this.playerMap.set(player.id, player);
  }

  @action removePlayer(id) {
    this.playerMap.forEach(existingPlayer => {
      existingPlayer.commanderDamage.delete(id);
    });
    this.playerMap.delete(id);
  }

  @computed get players() {
    return this.playerMap.values();
  }
}