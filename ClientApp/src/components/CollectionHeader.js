import {
  ActionButton,
  CommandButton,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from '@fluentui/react'
import React, { useEffect, useRef, useState } from 'react'
import '../components/Reminder.css'
import { useText } from '../custom_hooks'
import { TaskSortType } from '../enums'

export const CollectionHeader = ({
  name,
  onDelete,
  onEdit,
  onSort,
  sortType,
  isLoading,
}) => {
  const [focus, setFocus] = useState(false)

  const [dialogHidden, setDialogHidden] = useState(true)

  const headerRef = useRef(null)

  const handleNameChange = v => {
    setFocus(false)

    if (v !== name) {
      onEdit(v)
    }
  }

  const { value, setValue, handleOnChange, handleOnKeyUp } = useText(
    name,
    handleNameChange,
    false,
  )

  useEffect(() => {
    if (focus) {
      headerRef.current.focus()
    }
  }, [focus])

  return (
    <Stack horizontal>
      <Stack.Item align='center' grow={0}>
        {focus && !!onEdit ? (
          <input
            type={'text'}
            ref={headerRef}
            style={{
              paddingLeft: '16px',
              fontSize: '20px',
              fontWeight: '600',
              height: '40px',
              border: 'none',
            }}
            onBlur={e => handleNameChange(e.target.value)}
            onChange={handleOnChange}
            onKeyUp={handleOnKeyUp}
            value={value}
          />
        ) : (
          <ActionButton
            className={'outline-none'}
            styles={{
              root: {
                border: 'none',
                padding: '5px 0',
              },
            }}
            onClick={_ => {
              if (!!onEdit && !isLoading) {
                setFocus(true)
                setValue(name)
              }
            }}
            onRenderChildren={_ => {
              return (
                <Text variant={'xLarge'} className='px-3'>
                  {name}
                </Text>
              )
            }}
          />
        )}
      </Stack.Item>

      {!!onDelete && (
        <Stack.Item align='center' grow={0}>
          {isLoading ? (
            <Spinner size={SpinnerSize.small} />
          ) : (
            <>
              <IconButton
                className={'outline-none'}
                iconProps={{
                  iconName: 'More',
                }}
                styles={{ root: { color: '#000', fontSize: '16px' } }}
                title='CollapseMenu'
                ariaLabel='CollapseMenu'
                onRenderMenuIcon={_ => <></>}
                menuProps={{
                  onRenderMenuList: props => {
                    return props.items.map(p => {
                      let { key, iconProps, text, onClick } = p

                      return (
                        <CommandButton
                          key={key}
                          className={'outline-none hover-still-black'}
                          styles={{ root: { width: '100%' } }}
                          iconProps={iconProps}
                          text={text}
                          onClick={onClick}
                        />
                      )
                    })
                  },
                  items: [
                    {
                      key: 'delete',
                      onClick: () => setDialogHidden(false),
                      iconProps: {
                        iconName: 'Delete',
                        style: { color: 'red', fontWeight: '400' },
                      },
                      text: 'Delete',
                      title: 'Delete collection',
                    },
                  ],
                }}
                borderless
              />
              <Dialog
                hidden={dialogHidden}
                dialogContentProps={{
                  type: DialogType.largeHeader,
                  title: 'Delete confirm',
                  subText: `Are you sure to delete collection "${name}"?`,
                }}
                onDismiss={() => setDialogHidden(true)}
              >
                <DialogFooter>
                  <PrimaryButton
                    onClick={() => {
                      setDialogHidden(true)
                      onDelete()
                    }}
                    text='Confirm'
                  />
                  <DefaultButton
                    onClick={() => setDialogHidden(true)}
                    text='Cancel'
                  />
                </DialogFooter>
              </Dialog>
            </>
          )}
        </Stack.Item>
      )}

      {!!sortType && (
        <Stack.Item grow={1} horizontalAlign='end'>
          <Stack horizontalAlign='end'>
            <DefaultButton
              className={'outline-none'}
              iconProps={{ iconName: 'Sort' }}
              styles={{
                root: {
                  color: '#000',
                  border: 'none',
                  fontSize: '16px',
                },
              }}
              text={`Sort by ${sortType}`}
              disabled={isLoading}
              onRenderMenuIcon={_ => <></>}
              menuProps={{
                onRenderMenuList: props => {
                  return props.items.map(p => {
                    let { key, iconProps, text, onClick } = p

                    return (
                      <CommandButton
                        key={key}
                        className={'outline-none hover-still-black'}
                        styles={{ root: { width: '100%' } }}
                        iconProps={iconProps}
                        text={text}
                        onClick={onClick}
                      />
                    )
                  })
                },
                items: [
                  {
                    key: 'default',
                    onClick: _ => {
                      onSort(TaskSortType.Default)
                    },
                    iconProps: { iconName: 'AppIconDefault' },
                    text: 'Default',
                    title: 'Default',
                  },
                  {
                    key: 'due_date',
                    onClick: _ => {
                      onSort(TaskSortType.DueDate)
                    },
                    iconProps: { iconName: 'Calendar' },
                    text: 'Due Date',
                    title: 'Sort by due date',
                  },
                  {
                    key: 'alphabetically',
                    onClick: _ => {
                      onSort(TaskSortType.Alphabetically)
                    },
                    iconProps: { iconName: 'Sort' },
                    text: 'Alphabetically',
                    title: 'Sort by alphabets',
                  },
                ],
              }}
            />
          </Stack>
        </Stack.Item>
      )}
    </Stack>
  )
}
