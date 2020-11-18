import React, { Component } from 'react';
//import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Label } from '@fluentui/react';
import {LoginMenu} from "./api-authorization/LoginMenu";

const searchButtonStyles = {
    root: {
        width: 500,
    }
}

const _items = [
    {
        key: 'Reminder',
        text: 'Reminder',
        onRender: () =>
            <Label>Reminder</Label>
    },
    {
        key: 'search',
        text: 'Search',
        ariaLabel: 'Search',
        onRender: () =>
            <SearchBox
                placeholder='Search'
                onEscape={ev => {
                    console.log('Custom onEscape Called');
                }}
                onClear={ev => {
                    console.log('Custom onClear Called');
                }}
                onChange={(_, newValue) => console.log('SearchBox onChange fired: ' + newValue)}
                onSearch={newValue => console.log('SearchBox onSearch fired: ' + newValue)}
                styles={searchButtonStyles}
            />,
    }
]

const _farItems = [
    {
        key: 'settings',
        text: 'Settings',
        // This needs an ariaLabel since it's icon-only
        ariaLabel: 'Settings',
        iconOnly: true,
        iconProps: { iconName: 'Settings' },
        onClick: () => console.log('Info'),
    },
    {
        key: 'info',
        text: 'Help and Feedbacks',
        // This needs an ariaLabel since it's icon-only
        ariaLabel: 'Help',
        iconOnly: true,
        iconProps: { iconName: 'Help' },
        onClick: () => console.log('Help'),
    },
    {
        key: 'info',
        text: 'What `s news',
        // This needs an ariaLabel since it's icon-only
        ariaLabel: 'News',
        iconOnly: true,
        iconProps: { iconName: 'News' },
        onClick: () => console.log('News'),
    },
    {
        key: 'info',
        text: 'Account',
        // This needs an ariaLabel since it's icon-only
        ariaLabel: 'Info',
        iconOnly: true,
        iconProps: { iconName: 'ReminderPerson' },
        onClick: () => console.log('Account'),
    },

]

export class ToolBar extends Component {
    render() {
        return (
            <CommandBar
                items={_items}
                farItems={_farItems}
                styles={commandBarStyles}
            />
        )
    }
}

const commandBarStyles = {
    root: {
        
    }
}