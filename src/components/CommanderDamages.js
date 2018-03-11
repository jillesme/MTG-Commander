import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import HoldButton from './HoldButton';

@inject('store')
@observer
export default class CommanderDamages extends Component {

  handleIncreaseFrom(opponent) {
    this.props.store.increaseCommanderDamage(this.props.player.name, opponent)
  }

  handleDecreaseFrom(opponent) {
    this.props.store.decreaseCommanderDamage(this.props.player.name, opponent)
  }

  render() {
    const { player } = this.props;
    if (!player.commanderDamage) {
      return <span>Add more players!</span>
    }
    return (<div className="Player-CommanderDamages">
      <ul className="list-group">{
        Object.entries(player.commanderDamage).map(([opponentName, damage]) => (
          <li className="list-group-item" key={ opponentName }>
            <span className="badge badge-secondary">{ damage }</span>
            { opponentName }
            <div className="btn-group float-right" role="group">
              <HoldButton classNames="btn-success btn-sm" action={ () => this.handleIncreaseFrom(opponentName) }>+</HoldButton>
              <HoldButton classNames="btn-danger btn-sm" action={ () => this.handleDecreaseFrom(opponentName) }>-</HoldButton>
            </div>
          </li>))
      }</ul>
    </div>);
  }
}