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

@inject('store')
@observer
class CommanderDamage extends Component {

  handleIncrease() {
    this.props.store.increaseCommanderDamage(this.props.player, this.props.opponent)
  }

  handleDecrease() {
    this.props.store.decreaseCommanderDamage(this.props.player, this.props.opponent)
  }

  render() {
    const { opponent } = this.props;
    return (<div>
      { opponent.name } - { opponent.damage }
      <button onClick={ () => this.handleIncrease() }>+</button>
      <button onClick={ () => this.handleDecrease() }>-</button>
    </div>);
  }
}

@inject('store')
@observer
class Player extends Component {

  handleIncrease() {
    this.props.store.increaseLife(this.props.player)
  }

  handleDecrease() {
    this.props.store.decreaseLife(this.props.player)
  }

  handleDelete() {
    this.props.store.removePlayer(this.props.player.name);
  }


  render() {
    const { player } = this.props;
    return (<div className="Player">
      <p>{ player.name } - { player.life }</p>
      <button onClick={ () => this.handleIncrease() }>+</button>
      <button onClick={ () => this.handleDecrease() }>-</button>
      <br/>
      { player.commanderDamages.map(opponent => <CommanderDamage key={ opponent.name } player={ player } opponent={ opponent} />) }
      <button onClick={ () => this.handleDelete() }>X</button>
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
        <NewPlayer />

        <PlayerList />

        <button onClick={ () => store.reset() }>RESET</button>
      </div>);
  }
}

export default App;
