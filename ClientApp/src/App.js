import React, {Component} from 'react';
import {Route} from 'react-router';
import {Layout} from './components/Layout';
import {Home} from './components/Home';
import {FetchData} from './components/FetchData';
import {Counter} from './components/Counter';

import './custom.css'
import AuthorizeRoute from "./components/api-authorization/AuthorizeRoute";
import {ApplicationPaths} from "./components/api-authorization/ApiAuthorizationConstants";
import ApiAuthorizationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                {/* Use Route for unauthenticated route */}
                <Route exact path='/' component={Home}/>
                <Route path='/counter' component={Counter}/>
                {/* Use AuthorizeRoute for authenticated route */}
                <AuthorizeRoute path='/fetch-data' component={FetchData}/>
                <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes}/>
            </Layout>
        );
    }
}
