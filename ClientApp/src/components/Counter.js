import React, { Component } from 'react'
import { PrimaryButton } from '@fluentui/react'

export class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = { currentCount: 0 }
    this.incrementCounter = this.incrementCounter.bind(this)
  }

  incrementCounter() {
    this.setState({
      currentCount: this.state.currentCount + 1,
    })
  }

  render() {
    return (
      <div>
        <h1>Counter</h1>

        <PrimaryButton text='Click me' onClick={this.incrementCounter} />

        <p>This is a simple example of a React component.</p>

        <p aria-live='polite'>
          Current count: <strong>{this.state.currentCount}</strong>
        </p>

        <button className='btn btn-primary' onClick={this.incrementCounter}>
          Increment
        </button>
      </div>
    )
  }
}
