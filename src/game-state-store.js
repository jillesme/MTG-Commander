import { observable, action, computed, toJS } from 'mobx';
import uuid from 'uuid/v4';

class Player {
  id = '';
  name = '';
  @observable life = 40;
  @observable commanderDamage = observable.map({});

  constructor(id, name, life) {
    this.id = id;
    this.name = name;

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
    this.commanderDamage.get(fromPlayer.id).damage += amount;
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

  getGameState() {
    return JSON.stringify(toJS(this.playerMap));
  }

  @action loadGameState(state) {
    // In case player state is loaded mid game.
    this.playerMap.clear();

    Object.values(JSON.parse(state)).forEach(user => {
      const newPlayer = new Player(user.id, user.name, user.life);

      Object.keys(user.commanderDamage).forEach(opponentId => {
        newPlayer.commanderDamage.set(opponentId, user.commanderDamage[opponentId])
      });

      this.playerMap.set(newPlayer.id, newPlayer);
    });

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