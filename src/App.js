import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import './App.css';
import GameActions from './components/GameActions';
import { PlayerList } from './components/Player';

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
