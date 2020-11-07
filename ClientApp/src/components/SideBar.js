import React, { Component } from 'react';
import { Nav, initializeIcons } from "@fluentui/react";

const links = [
    {
        links:[
            {
                name: 'My Day',
                url: '/',
                key: 'key1',
                iconProps:{
                    iconName: 'In Progress',
                    styles:{
                        root: {
                            fontSize: 20,
                            color: '#106ebe',
                        }
                    }
                }
            },
            {
                name: 'Important',
                url: '/important',
                key: 'key2',
                iconProps:{
                    iconName: 'In Progress',
                    styles:{
                        root: {
                            fontSize: 20,
                            color: '#106ebe',
                        }
                    }
                }
            },
            {
                name: 'Planned',
                url: '/planned',
                key: 'key3',
                iconProps:{
                    iconName: 'News',
                    styles:{
                        root: {
                            fontSize: 20,
                            color: '#106ebe',
                        }
                    }
                }
            },
            {
                name: 'Shool',
                url: '/school',
                key: 'key4',
                iconProps:{
                    iconName: 'Simple',
                    styles:{
                        root: {
                            fontSize: 20,
                            color: '#106ebe',
                        }
                    }
                }
            }
        ]
    }
]

const toolbarStyles = {
    root:{
        height: '100vh',
        boxSizing: 'border-box',
        border: '1px solid #eee',
        overflowY: 'auto',
        width: 208,
    }
}

initializeIcons();

export class SideBar extends Component{
    render(){
        return(
            <Nav
            groups = {links}
            selectedKey = {this.props.link}
            styles = {toolbarStyles}
            />
        )
    }
}