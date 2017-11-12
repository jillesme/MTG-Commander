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
    const { opponent } = this.props;
    return (<div>
      <p>{ opponent.name }: { opponent.damage }</p>
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
    return (<div>
      <div>
        <button onClick={ () => store.removePlayer(player.id) }>X</button>
        <h2 style={ { 'textDecoration': player.isDead ? 'line-through' : '' } }>{ player.name } ({ player.life })</h2>

        <div>
          <input type="range" min={ 1 } max={ 10 } value={ this.impact } onChange={ ev => this.impact = ev.target.value } />
          <span>{ this.impact }</span>
          <button onClick={ () => this.handleClick() }>Pow</button>
          <label>
            <input type="checkbox" selected={ this.isLifeGain } onChange={ ev => this.isLifeGain = ev.target.checked } />
            Increase Life
          </label>
        </div>
      </div>

      <div>
        { player.commanderDamage.values().map((sender, i) => (<CommanderDamage player={ player } opponent={ sender } key={ i } />)) }
      </div>
    </div>)
  }
}

const PlayerList = inject('store')(observer(({ store }) => (
  <div>
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
