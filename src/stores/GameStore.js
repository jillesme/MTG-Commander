import { observable, action, toJS } from 'mobx';

import { LIFE_TOTAL } from '../constants';

export default class GameStore {
  @observable isLoading = true;
  @observable players = observable.map({});

  database;

  constructor(database) {
    this.database = database;
  }

  @action
  onPlayerAddedOrUpdated(snapshot) {
    const player = snapshot.val();
    player.name = snapshot.key;
    this.players.set(snapshot.key, player);
  }

  @action
  onPlayerRemoved(snapshot) {
    this.players.delete(snapshot.key);
  }

  initialise() {
    this.database.ref('players').once('value', action(() => {
      this.isLoading = false;
    }));

    this.database.ref('players').on('child_added', this.onPlayerAddedOrUpdated.bind(this));
    this.database.ref('players').on('child_changed', this.onPlayerAddedOrUpdated.bind(this));
    this.database.ref('players').on('child_removed', this.onPlayerRemoved.bind(this));

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
      life: LIFE_TOTAL,
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
    this.database.ref('players/' + player).child('life').transaction(life => life + 1);
  }

  decreaseLife(player) {
    const currentLife = this.players.get(player).life;
    if (currentLife > 0) {
      this.database.ref('players/' + player).child('life').transaction(life => life - 1);
    }
  }

  increaseCommanderDamage(player, opponent) {
    this.decreaseLife(player);

    this.database.ref('players/' + player).child('commanderDamage').transaction(damages => {
      damages[opponent] = damages[opponent] + 1;
      return damages;
    });
  }

  decreaseCommanderDamage(player, opponent) {
    this.database.ref('players/' + player).child('commanderDamage').transaction(damages => {
      if (damages[opponent] > 0) {
        this.increaseLife(player);
        damages[opponent] = damages[opponent] - 1;
      }
      return damages;
    });
  }

  reset() {
    const players = toJS(this.players);

    Object.keys(players).forEach(player => {
      players[player].life = LIFE_TOTAL;

      Object.keys(players[player].commanderDamage).forEach(opponent => {
        players[player].commanderDamage[opponent] = 0;
      });
    });


    this.database.ref('players/').update(players)
  }
}