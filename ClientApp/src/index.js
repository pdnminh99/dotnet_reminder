import 'bootstrap/dist/css/bootstrap.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute'
import { Route, Switch } from 'react-router'
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants'
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes'
import './custom.css'
import { Reminder } from './components/Reminder'
import { initializeIcons } from '@fluentui/react'

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')

initializeIcons()

const App = () => (
  <Switch>
    <AuthorizeRoute exact path={'/'} component={Reminder} />
    <AuthorizeRoute exact path={'/today'} component={Reminder} />
    <AuthorizeRoute exact path={'/planned'} component={Reminder} />
    <AuthorizeRoute exact path={'/flagged'} component={Reminder} />
    <AuthorizeRoute exact path={'/tasks'} component={Reminder} />
    <AuthorizeRoute exact path={'/collection/:cid'} component={Reminder} />
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
