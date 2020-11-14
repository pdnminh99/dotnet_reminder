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
        onRender: ()=> <LoginMenu></LoginMenu>
    },

]

// const _overflowItems = [
//     { key: 'move', text: 'Move to...', onClick: () => console.log('Move to'), iconProps: { iconName: 'MoveToFolder' } },
//     { key: 'copy', text: 'Copy to...', onClick: () => console.log('Copy to'), iconProps: { iconName: 'Copy' } },
//     { key: 'rename', text: 'Rename...', onClick: () => console.log('Rename'), iconProps: { iconName: 'Edit' } },
// ];

// const _overflowProps = { ariaLabel: 'News' };

export class ToolBar extends Component {
    render() {
        return (
            <CommandBar
                items={_items}
                // overflowItems={_overflowItems}
                // overflowButtonProps={_overflowProps}
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