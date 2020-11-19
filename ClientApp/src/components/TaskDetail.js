import { DefaultButton, Stack, TextField } from '@fluentui/react'
import React from 'react'

export const TaskDetail = () => {
  return <Stack tokens={{ childrenGap: 10 }}>
    <Stack.Item align='stretch'>
      <Stack className='ms-bgColor-white ms-depth-4'>
        <Stack.Item align='stretch'>
          <Stack horizontal className={'px-3 py-2'}>
            <Stack.Item align='center' grow={0}>
              <input type='checkbox' style={{ borderRadius: '9999px' }} />
            </Stack.Item>

            <Stack.Item align='stretch' grow={1}>
              <TextField borderless className={'px-2'} placeholder={'Do homework'}
                         styles={{ root: { border: 'none' } }} />
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <TextField multiline borderless className='p-2' row={3} resizable={true}
                     placeholder={'Lorem ipsum dolor sit amet'}
                     styles={{ root: { border: 'none' } }} />
        </Stack.Item>
      </Stack>
    </Stack.Item>

    <Stack.Item align={'stretch'}>
      <Stack className={'ms-bgColor-white ms-depth-4'}>
        <ControlWrapper>
          <Button content={'Remind me'} iconName={'AddFriend'} />
        </ControlWrapper>

        <ControlWrapper>
          <Button content={'Add due date'} iconName={'AddFriend'} />
        </ControlWrapper>

        <ControlWrapper>
          <Button content={'Repeat'} iconName={'AddFriend'} />
        </ControlWrapper>
      </Stack>
    </Stack.Item>

    <ControlWrapper>
      <Button content={'Flag'} iconName={'AddFriend'} />
    </ControlWrapper>

    <ControlWrapper>
      <Button content={'Delete'} iconName={'AddFriend'} />
    </ControlWrapper>
  </Stack>
}

const ControlWrapper = ({ children }) => {
  return <Stack.Item align={'stretch'} className={'ms-bgColor-white ms-depth-4 bg-gray-300--hover:hover'}>
    {children}
  </Stack.Item>
}

const Button = ({ content, iconName }) => {
  return <DefaultButton borderless className={'w-100 px-2 py-3'}
                        allowDisabledFocus={true}
                        styles={{ root: { border: 'none', height: '50px' } }}
                        iconProps={{ iconName }}>
    <span className={'px-3'}>{content}</span>
  </DefaultButton>
}
