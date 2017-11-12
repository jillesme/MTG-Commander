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
      <div className="new-player">
        <input type="text" value={ this.name } placeholder="Name.." onChange={ ev => this.handleChange(ev) } />
        <button disabled= { this.name.length < 1 } onClick={ () => this.handleClick() }>Add</button>
      </div>
    )
  }
}

const CommanderDamage = observer(({ player, opponent }) => (<div>
  <p>{ opponent.name }: { opponent.damage }
  <button onClick={ () => player.increaseCommanderDamage(opponent) }>+</button></p>
</div>));

const Player = inject('store')(observer(({ player, store }) => (<div className="player">
  <div className="player-heading">
    <button onClick={ () => store.removePlayer(player.id) }>X</button>
    <h2 style={ { 'textDecoration': player.isDead ? 'line-through' : '' } }>{ player.name } ({ player.life })</h2>

    <div className="player-controls">
      <button onClick={ () => player.decreaseLife() }>-</button>
      <button onClick={ () => player.increaseLife() }>+</button>
    </div>
  </div>

  <div class="player-commander-damages">
  { player.commanderDamage.values().map((sender, i) => (<CommanderDamage player={ player } opponent={ sender } key={ i } />)) }
  </div>
</div>)));


const PlayerList = inject('store')(observer(({ store }) => (
  <div className="player-list">
    { store.players.map(player => <Player key={ player.id } player={ player } />) }
  </div>
)));


const App = () => (
  <div>
    <NewPlayer />
    <PlayerList />
  </div>
);

export default App;
