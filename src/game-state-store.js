import { observable, action, computed } from 'mobx';
import uuid from 'uuid/v4';

class Player {
  id = null;
  name = '';
  @observable life = 40;
  @observable commanderDamage = observable.map({});

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  @action increaseCommanderDamage(playerId) {
    const currentDamage = this.commanderDamage.get(playerId);
    currentDamage.damage += 1;
    this.life -= 1;

    this.commanderDamage.set(playerId, currentDamage);
  }

  @computed get commanderDamages() {
    return this.commanderDamage.values()
  }

  @computed get isDead() {
    return this.life === 0 || this.commanderDamage.values().some(player => player.damage >= 21);
  }

  toString() {
    return this.name;
  }
}

export default class GameStateStore {
  @observable playerMap = observable.map({});

  constructor(initialPlayers) {
    initialPlayers.forEach(this.addPlayer, this);
  }

  @action addPlayer(name) {
    const player = new Player(uuid(), name);

    // Set commander damage for all players and current player
    this.playerMap.forEach(existingPlayer => {
      existingPlayer.commanderDamage.set(player.id, { id: player.id, name: player.name, damage: 0 });
      player.commanderDamage.set(existingPlayer.id, { id: existingPlayer.id, name: existingPlayer.name, damage: 0 });
    });

    this.playerMap.set(player.id, player);
  }

  @action removePlayer(id) {
    this.playerMap.forEach(existingPlayer => {
      existingPlayer.commanderDamage.delete(id);
    });
    this.playerMap.delete(id);
  }

  @action increaseLife(id) {
    this.playerMap.get(id).life += 1;
  }

  @action decreaseLife(id) {
    this.playerMap.get(id).life -= 1;
  }

  @action dealCommanderDamage(receiverId, senderId) {
    this.playerMap.get(receiverId).increaseCommanderDamage(senderId);
  }

  @computed get players() {
    return this.playerMap.values();
  }
}