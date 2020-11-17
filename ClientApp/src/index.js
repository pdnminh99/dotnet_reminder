import 'bootstrap/dist/css/bootstrap.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute'
import { Home } from './components/Home'
import { Counter } from './components/Counter'
import { FetchData } from './components/FetchData'
import { Route } from 'react-router'
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants'
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes'
import './custom.css'

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')
const rootElement = document.getElementById('root')

const App = () => {
  const displayName = App.name

  return <>
    <Layout>
      <AuthorizeRoute exact path='/' component={Home} />
      <AuthorizeRoute path='/counter' component={Counter} />
      <AuthorizeRoute path='/fetch-data' component={FetchData} />
      <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
    </Layout>
  </>
}

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <App />
  </BrowserRouter>,
  rootElement,
)
