import React, { useState } from 'react'
import { PrimaryButton } from '@fluentui/react'


export function Counter() {

  const [count, setCount] = useState(0)

  const incrementCounter = () => setCount(count + 1)

  return <>
    <div>
      <h1>Counter</h1>

      <p>This is a simple example of a React component.</p>

      <p aria-live='polite'>
        Current count: <strong>{count}</strong>
      </p>

      <PrimaryButton text='Click me' onClick={incrementCounter} />
    </div>
  </>
}
