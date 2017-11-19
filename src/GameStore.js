import { observable, action } from 'mobx';
import { DefaultState } from './constants';

class Player {
  name = '';
  life = 40;
  commanderDamages = [];

  constructor(name, data) {
    this.name = name;
    this.life = data.life;
    this.commanderDamages = Object.keys(data.commanderDamage || []).map((player, i) => {
      return {
        id: i,
        name: player,
        damage: data.commanderDamage[player]
      };
    });
  }
}

export default class GameStore {
  @observable isLoading = true;
  @observable players = observable.map({});

  database;

  constructor(database) {
    this.database = database;
  }

  @action
  onPlayerAddedOrUpdated(snapshot) {
    this.players.set(snapshot.key, new Player(snapshot.key, snapshot.val()));
  }

  @action
  onPlayerRemoved(snapshot) {
    this.players.delete(snapshot.key);
  }

  initialise() {
    this.database.ref('players').on('child_added', this.onPlayerAddedOrUpdated.bind(this));
    this.database.ref('players').on('child_changed', this.onPlayerAddedOrUpdated.bind(this));
    this.database.ref('players').on('child_removed', this.onPlayerRemoved.bind(this));

    this.isLoading = false;
  }

  removePlayer(name) {
    // Removes new player name from commander damages
    const removeQuery = this.players.values().reduce((acc, player) => {
      acc[player.name + '/commanderDamage/' + name] = null;
      return acc;
    }, {});

    // Remove player from DB
    this.database.ref(`players/${name}`).remove();
    this.database.ref('players').update(removeQuery);
  }

  addPlayer(name) {
    const insertQuery = {
      life: 40,
      // Adds existing player's name to new player commander damages
      commanderDamage: this.players.values().reduce((acc, player) => {
        acc[player.name] = 0;
        return acc
      }, {})
    };

    // Add new player's name to existing player commander damages
    const updateQuery = this.players.values().reduce((acc, player) => {
      acc[player.name + '/commanderDamage/' + name ] = 0;
      return acc;
    }, {});

    this.database.ref('players').update(updateQuery);
    this.database.ref('players/' + name).set(insertQuery);
  }

  increaseLife(player) {
    this.database.ref('players/' + player.name).child('life').transaction(life => life + 1);
  }

  decreaseLife(player) {
    this.database.ref('players/' + player.name).child('life').transaction(life => life - 1);
  }

  increaseCommanderDamage(player, opponent) {
    this.decreaseLife(player);

    this.database.ref('players/' + player.name).child('commanderDamage').transaction(damages => {
      damages[opponent.name] = damages[opponent.name] + 1;
      return damages;
    });
  }

  decreaseCommanderDamage(player, opponent) {
    this.increaseLife(player);

    this.database.ref('players/' + player.name).child('commanderDamage').transaction(damages => {
      damages[opponent.name] = damages[opponent.name] - 1;
      return damages;
    });
  }

  reset() {
    this.database.ref().set(DefaultState);
  }
}