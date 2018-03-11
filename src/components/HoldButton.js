import React, { Component } from 'react';

export default class HoldButton extends Component {
  timeout = null;
  interval = null;

  handleDown() {
    this.timeout = setTimeout(() => {

      this.interval = setInterval(() => {
        this.props.action();
      }, 100);

    }, 500);
  }

  handleUp() {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  }

  render() {
    const { action, classNames, children: content } = this.props;
    return (
      <button
        type="button"
        className={`btn ${classNames}`}
        onClick={ () => action() }

        onMouseDown={ () => this.handleDown() }
        onTouchStart={ () => this.handleDown() }

        onMouseUp={ () => this.handleUp() }
        onTouchEnd={ () => this.handleUp() }>
        { content }
      </button>)
  }
}
