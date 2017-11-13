import { observable, action, computed, toJS } from 'mobx';

class Player {
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

      this.playerMap.set(newPlayer.name, newPlayer);
    });

  }

  lastUsedId = 0;
  @action addPlayer(name) {
    const player = new Player(this.lastUsedId++, name);

    // Set commander damage for all players and current player
    this.playerMap.forEach(existingPlayer => {
      existingPlayer.commanderDamage.set(player.name, 0);
      player.commanderDamage.set(existingPlayer.name, 0);
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