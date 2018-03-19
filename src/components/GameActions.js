import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
export default class GameActions extends Component {
  @observable name = '';

  handleChange(ev) {
    this.name = ev.target.value;
  }

  handleClick() {
    this.props.store.addPlayer(this.name);
    this.name = '';
  }

  handleGameReset() {
    this.props.store.reset();
  }

  handleRandomPlayer() {
    this.props.store.randomPlayerAlert();
  }

  isButtonDisabled() {
    return this.props.store.players.has(this.name) || this.name < 3;
  }

  render() {
    return (
      <div className="NewPlayer">
        <form className="form-inline">
          <div className="input-group">
            <input className="form-control" type="text" value={ this.name } placeholder="Name.." onChange={ ev => this.handleChange(ev) } />
            <button className="btn btn-secondary" disabled={ this.isButtonDisabled() } onClick={ () => this.handleClick() }>Add</button>
          </div>
          <button className="btn btn-secondary" type="button" onClick={ () => this.handleGameReset() }>Reset Game</button>
          <button className="btn btn-primary" type="button" onClick={ () => this.handleRandomPlayer() }>Random Player</button>
        </form>
      </div>
    );
  }
}