import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import './App.css';

@inject('store')
@observer
class GameActions extends Component {
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
        </form>
      </div>
    );
  }
}

@inject('store')
@observer
class CommanderDamages extends Component {

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
              <button type="button" className="btn btn-success btn-sm" onClick={ () => this.handleIncreaseFrom(opponentName) }>+</button>
              <button type="button" className="btn btn-danger btn-sm" onClick={ () => this.handleDecreaseFrom(opponentName) }>-</button>
            </div>
          </li>))
      }</ul>
    </div>);
  }
}

@inject('store')
@observer
class Player extends Component {
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
        <button type="button" className="btn btn-success" onClick={ () => this.handleIncrease() }>+</button>
        <button type="button" className="btn btn-danger" onClick={ () => this.handleDecrease() }>-</button>
      </div>
      </form>

      <div className={ this.isExpanded ? '' : 'd-none' }>
        <CommanderDamages player={ player } />
        <button type="button" className="btn btn-warning" onClick={ () => this.handleDelete() }>Delete</button>
      </div>

    </div>)
  }
}

@inject('store')
@observer
class PlayerList extends Component {
  render() {
    return (<div className="PlayerList">
      { this.props.store.players.values().map(player => <Player key={ player.name } player={ player } />) }
    </div>)
  }
}

const Loading = () => <h1>Loading...</h1>;

@inject('store')
@observer
class App extends Component {
  componentDidMount() {
    this.props.store.initialise();
  }
  render() {
    const { store } = this.props;
    if (store.isLoading) {
      return <Loading />;
    }

    return (
      <div className="App">
        <PlayerList />

        <GameActions />
      </div>);
  }
}

export default App;
