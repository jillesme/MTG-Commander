import { observable, action, computed, toJS } from 'mobx';

import Player from './Player.model';

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