import React, { Component } from 'react';
// import { NavMenu } from './NavMenu';
import { SideBar } from "./SideBar";
import 'office-ui-fabric-core/dist/css/fabric.min.css'
import { ToolBar } from './ToolBar';
import { Home } from './Home';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        {/* <NavMenu /> */}

        <div className="ms-Grid" dir="ltr">
          <ToolBar />
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm2 ms-xl2">
              <SideBar />
            </div>
            <div className="ms-Grid-col ms-sm10 main-element">
              {/* <div className="ms-Grid-row">
              </div>
              <div className="ms-Grid-row">

              </div> */}
              <Home/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
