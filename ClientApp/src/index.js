import 'bootstrap/dist/css/bootstrap.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute'
import { Route, Switch } from 'react-router'
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants'
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes'
import './custom.css'
import { Reminder } from './containers'
import { initializeIcons } from '@fluentui/react'

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')

initializeIcons()

const App = () => (
  <Switch>
    <AuthorizeRoute path={'/'} component={Reminder} />
    <Route
      path={ApplicationPaths.ApiAuthorizationPrefix}
      component={ApiAuthorizationRoutes}
    />
  </Switch>
)

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
)
