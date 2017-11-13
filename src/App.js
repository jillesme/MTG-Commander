import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import './App.css';

@inject('store')
@observer
class NewPlayer extends Component {
  @observable name = '';

  handleChange(ev) {
    this.name = ev.target.value;
  }

  handleClick() {
    this.props.store.addPlayer(this.name);
    this.name = '';
  }

  render() {
    return (
      <div>
        <input type="text" value={ this.name } placeholder="Name.." onChange={ ev => this.handleChange(ev) } />
        <button disabled= { this.name.length < 1 } onClick={ () => this.handleClick() }>Add</button>
      </div>
    )
  }
}

@observer
class CommanderDamage extends Component {
  @observable impact = 1;

  handleChange(ev) {
    this.impact = ev.target.value;
  }

  handleClick() {
    const { player, opponent } = this.props;
    player.increaseCommanderDamage(opponent, +this.impact);
    this.impact = 1;
  }

  render() {
    const { opponent, damage } = this.props;
    return (<div>
      <p>{ opponent }: { damage }</p>
      <input type="range" value={ this.impact } min={ 1 } max={ 10 } onChange={ ev => this.handleChange(ev) } /><span>{ this.impact }</span>
      <button onClick={ () => this.handleClick() }>Bang</button>
    </div>);
  }
}

@inject('store')
@observer
class Player extends Component {
  @observable impact = 1;
  @observable isLifeGain = false;

  handleClick() {
    this.props.player.modifyLife(+this.impact, this.isLifeGain);

    this.impact = 1;
    this.isLifeGain = false;
  }

  render() {
    const { store, player } = this.props;
    return (<div className={ `Player ${ player.isDead ? 'Dead' : '' } `}>
      <div className="Player-Header">
        <span>{ player.life }</span>
        <h2>{ player.name }</h2>
        <button onClick={ () => store.removePlayer(player.name) }>X</button>
      </div>

        <div>
          <input type="range" min={ 1 } max={ 10 } value={ this.impact } onChange={ ev => this.impact = ev.target.value } />
          <span>{ this.impact }</span>
          <button onClick={ () => this.handleClick() }>Pow</button>
          <label>
            <input type="checkbox" checked={ this.isLifeGain } onChange={ ev => this.isLifeGain = ev.target.checked } />
            Gain
          </label>
        </div>

      <div>
        { player.commanderDamage.entries().map(([opponent, damage], i) => (<CommanderDamage player={ player } opponent={ opponent } damage={ damage } key={ i } />)) }
      </div>
    </div>)
  }
}

const PlayerList = inject('store')(observer(({ store }) => (
  <div className="PlayerList">
    { store.players.map(player => <Player key={ player.name } player={ player } />) }
  </div>
)));

@inject('store')
@observer
class GameStateActions extends Component {
  @observable gameState = '';

  render() {
    const { store } = this.props;
    return (<div>
      <textarea placeholder="Game State" value={ this.gameState } onChange={ ev => this.gameState = ev.target.value }></textarea>
      <button onClick={ () => this.gameState = store.getGameState() }>Get Current</button>
      <button onClick={ () => store.loadGameState(this.gameState) }>Load</button>
    </div>)
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <NewPlayer />
        <PlayerList />

        <GameStateActions />
      </div>)
  }
};

export default App;
