import React, { Component } from 'react';
//import { NavMenu } from './NavMenu';
import { SideBar } from "./SideBar";
import 'office-ui-fabric-core/dist/css/fabric.min.css'
import { ToolBar } from './ToolBar';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        {/* <NavMenu /> */}
        <ToolBar/>
        <div className = "ms-Grid" dir="ltr">
          <div className = "ms-Grid-row">
            <div className = "ms-Grid-col ms-sm1 ms-xl1">
              <SideBar/>
            </div>
            <div className = "ms-Grid-col ms-sm11 main-element">
              <div className = "ms-Grid-row">

              </div>
              <div className = "ms-Grid-row">

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
