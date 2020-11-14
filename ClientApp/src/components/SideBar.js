import React, { Component } from 'react';
import { Nav, initializeIcons } from "@fluentui/react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ScrollablePane } from 'office-ui-fabric-react/lib/ScrollablePane';
import { getTheme, mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

const theme = getTheme();

const defaultLinks = [
    {
        links: [
            {
                name: 'My Day',
                url: '/my-day',
                iconProps: {
                    iconName: 'Sunny',
                    styles: {
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
                iconProps: {
                    iconName: 'FavoriteStar',
                    styles: {
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
                iconProps: {
                    iconName: 'Calendar',
                    styles: {
                        root: {
                            fontSize: 20,
                            color: '#106ebe',
                        }
                    }
                }
            },
            {
                name: 'Tasks',
                url: '/tasks',
                iconProps: {
                    iconName: 'ClipboardList',
                    styles: {
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

const customLinks = [
    {
        links: [
            {
                name: 'School',
                url: '/school',
                iconProps: {
                    iconName: 'BulletedList2',
                    styles: {
                        root: {
                            fontSize: 20,
                            color: '#106ebe',
                        }
                    }
                }
            },
            {
                name: 'Study',
                url: '/study',
                iconProps: {
                    iconName: 'BulletedList2',
                    styles: {
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

const addCollectionProps = {
    iconName: 'Add',
    styles: {
        root: {
            fontSize: 20,
            color: '#106ebe',
        }
    }
}

const addCollectionStyle = {

}

initializeIcons();

const sideBarStyles = {
    root: {
        height: 'auto',
        overflowY: 'auto',
        width: 'auto',
    }
}


const classNames = mergeStyleSets({
    wrapper: {
        position: 'relative',
        maxHeight: 'inherit',
        width: 'auto',
    },
    pane: {
        height: '98vh',
        border: '1px solid ' + theme.palette.neutralLight,
    },
});

const scrollablePaneStyles = { root: classNames.pane };

export class SideBar extends Component {
    render() {
        return (
            <div className={classNames.wrapper}>
                <ScrollablePane styles={scrollablePaneStyles}>
                    <Nav
                        groups={defaultLinks}
                        selectedKey={this.props.link}
                        styles={sideBarStyles}
                    />
                    <TextField
                        iconProps={addCollectionProps}
                        placeholder='Add a New Collection'
                        underlined
                    />
                    <Nav
                        groups={customLinks}
                        selectedKey={this.props.link}
                        styles={sideBarStyles}
                    />                    
                </ScrollablePane>

            </div>

        )
    }
}