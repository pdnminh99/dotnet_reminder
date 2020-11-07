import React, { Component } from 'react';
//import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { CommandBarButton } from 'office-ui-fabric-react/lib/Button';
import { DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import {
    ContextualMenuItem,
  } from 'office-ui-fabric-react/lib/ContextualMenu';
import { getTheme, concatStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { memoizeFunction } from 'office-ui-fabric-react/lib/Utilities';


const theme = getTheme();

const itemStyles = {
    label: { fontSize: 18 },
    icon: { color: theme.palette.red },
    iconHovered: { color: theme.palette.redDark },
};
const menuStyles = {
    subComponentStyles: { menuItem: itemStyles, callout: {} },
};


const getCommandBarButtonStyles = memoizeFunction(
    (originalStyles = this.props.styles | undefined) => {
      if (!originalStyles) {
        return itemStyles;
      }
  
      return concatStyleSets(originalStyles, itemStyles);
    },
  );
  
  // Custom renderer for main command bar items
  const CustomButton = props => {
    const buttonOnMouseClick = () => alert(`${props.text} clicked`);
    // eslint-disable-next-line react/jsx-no-bind
    return <CommandBarButton {...props} onClick={buttonOnMouseClick} styles={getCommandBarButtonStyles(props.styles)} />;
  };
  
  // Custom renderer for menu items (these must have a separate custom renderer because it's unlikely
  // that the same component could be rendered properly as both a command bar item and menu item).
  // It's also okay to custom render only the command bar items without changing the menu items.
  const CustomMenuItem = props => {
    const buttonOnMouseClick = () => alert(`${props.item.text} clicked`);
    // Due to ContextualMenu implementation quirks, passing styles here doesn't work
    // eslint-disable-next-line react/jsx-no-bind
    return <ContextualMenuItem {...props} onClick={buttonOnMouseClick} />;
  };

const overflowProps = {
    ariaLabel: 'More commands',
    menuProps: {
        contextualMenuItemAs: CustomMenuItem,
        // Styles are passed through to menu items here
        buttonAs: {CustomButton},
        styles: menuStyles,
        items: [], // CommandBar will determine items rendered in overflow
        isBeakVisible: true,
        beakWidth: 20,
        gapSpace: 10,
        directionalHint: DirectionalHint.topCenter,
    },
};

const overflowItems = [
    {
        items: [
            {
                key: 'move',
                text: 'Move to...',
                onClick: () => console.log('Move to'),
                iconProps: { iconName: 'MoveToFolder' }
            },
            {
                key: 'copy',
                text: 'Copy to...',
                onClick: () => console.log('Copy to'),
                iconProps: { iconName: 'Copy' }
            },
            {
                key: 'rename',
                text: 'Rename...',
                onClick: () => console.log('Rename'),
                iconProps: { iconName: 'Edit' }
            },
        ]
    }
]

const rightItems = [
    {
        items: [
            {
                key: 'setting',
                text: 'Setting',
                url: '/setting',
                iconProps: {
                    iconName: 'Info'
                },
                iconOnly: true,
                // onClick = () => console.log('this is Setting')
            },
            {
                key: 'new',
                text: 'Setting',
                url: 'new',
                iconProps: {
                    iconName: 'New'
                },
                iconOnly: true,
                // onClick = () => console.log('this is New')
            }
        ]
    }
]


export class ToolBar extends Component{
    render(){
        return(
            <CommandBar
            overflowButtonProps={overflowProps}
            // Custom render all buttons
            overflowItems={overflowItems}
            rightItems={rightItems}
            ariaLabel="Use left and right arrow keys to navigate between commands"
            
        />
        )
    }
}