import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';

import HoldButton from './HoldButton';
import CommanderDamages from './CommanderDamages';


const PlayerListComponent = ({ store }) => {
  return (<div className="PlayerList">
    { store.players.values().map(player => <Player key={ player.name } player={ player } />) }
  </div>)
};

export const PlayerList = inject('store')(observer(PlayerListComponent));

@inject('store')
@observer
export class Player extends Component {
  @observable isExpanded = false;

  handleIncrease() {
    this.props.store.increaseLife(this.props.player.name)
  }

  handleDecrease() {
    this.props.store.decreaseLife(this.props.player.name)
  }

  handleDelete() {
    this.props.store.removePlayer(this.props.player.name);
  }

  toggleView() {
    this.isExpanded = !this.isExpanded;
  }

  getLifeColour() {
    const { player } = this.props;
    if (player.life >= 25) {
      return 'badge-success';
    } else if (player.life < 25 && player.life >= 10) {
      return 'badge-warning';
    }
    return 'badge-danger';
  }

  render() {
    const { player } = this.props;
    return (<div className="Player">

      <form className="form-inline Player-Header">
        <h2 onClick={ () => this.toggleView() }>
          <span className={ `badge ${this.getLifeColour()} mr-1` }>{ player.life }</span>
          { player.name }</h2>

      <div className="btn-group" role="group">
        <HoldButton classNames="btn-success" action={ () => this.handleIncrease() }>+</HoldButton>
        <HoldButton classNames="btn-danger" action={ () => this.handleDecrease() }>-</HoldButton>
      </div>
      </form>

      <div className={ this.isExpanded ? '' : 'd-none' }>
        <CommanderDamages player={ player } />
        <button type="button" className="btn btn-warning" onClick={ () => this.handleDelete() }>Delete</button>
      </div>

    </div>)
  }
}

export default PlayerList;