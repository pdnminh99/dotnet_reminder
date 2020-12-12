import { Image, ImageFit, Stack, Text } from '@fluentui/react'
import loadingPic from '../assets/images/please-be-patient.png'
import goalSuccess from '../assets/images/awards.png'
import error from '../assets/images/error.png'
import empty from '../assets/images/no-messages.png'
import build from '../assets/images/build.png'
import searching from '../assets/images/searching.png'
import React from 'react'

export const Error = () => {
  return (
    <Stack
      verticalAlign={'center'}
      horizontalAlign={'center'}
      className={'h-100 w-100'}
    >
      <Stack.Item grow={0}>
        <Image
          imageFit={ImageFit.contain}
          width={800}
          height={400}
          src={error}
          alt={'404! Not Found.'}
        />
      </Stack.Item>

      <Text
        styles={{ root: { color: '#0078d7', fontWeight: 600 } }}
        variant={'xxLarge'}
      >
        404! Not Found.
      </Text>

      <Text
        className={'pb-10'}
        styles={{ root: { color: 'gray' } }}
        variant={'mediumPlus'}
      >
        Something just happened! :(
      </Text>
    </Stack>
  )
}

export const EmptyTasksList = () => {
  return (
    <Stack
      verticalAlign={'center'}
      horizontalAlign={'center'}
      className={'h-100 w-100'}
    >
      <Stack.Item grow={0}>
        <Image
          imageFit={ImageFit.contain}
          width={800}
          height={400}
          src={empty}
          alt={"No today's tasks"}
        />
      </Stack.Item>

      <Text
        styles={{ root: { color: '#0078d7', fontWeight: 600 } }}
        variant={'xxLarge'}
      >
        This collection is empty!
      </Text>

      <Text
        className={'pb-10'}
        styles={{ root: { color: 'gray' } }}
        variant={'mediumPlus'}
      >
        How about creating some tasks?
      </Text>
    </Stack>
  )
}

export const EmptyTodayTasksList = () => {
  return (
    <Stack
      verticalAlign={'center'}
      horizontalAlign={'center'}
      className={'h-100 w-100'}
    >
      <Stack.Item grow={0}>
        <Image
          imageFit={ImageFit.contain}
          width={800}
          height={400}
          src={goalSuccess}
          alt={"No today's tasks"}
        />
      </Stack.Item>

      <Text
        styles={{ root: { color: '#0078d7', fontWeight: 600 } }}
        variant={'xxLarge'}
      >
        Amazing good job!
      </Text>

      <Text
        className={'pb-10'}
        styles={{ root: { color: 'gray' } }}
        variant={'mediumPlus'}
      >
        You have no tasks for today
      </Text>
    </Stack>
  )
}

export const LoadingScreen = () => {
  return (
    <Stack
      verticalAlign={'center'}
      horizontalAlign={'center'}
      className={'h-100 w-100'}
    >
      <Stack.Item grow={0}>
        <Image
          imageFit={ImageFit.contain}
          width={800}
          height={400}
          src={loadingPic}
          alt={'Loading screen'}
        />
      </Stack.Item>

      <Text
        styles={{ root: { color: '#0078d7', fontWeight: 600 } }}
        variant={'xxLarge'}
      >
        Please be patient!
      </Text>

      <Text
        className={'pb-10'}
        styles={{ root: { color: 'gray' } }}
        variant={'mediumPlus'}
      >
        We are fetching some data
      </Text>
    </Stack>
  )
}

export const NoContent = ({ width, height }) => {
  return (
    <Stack
      verticalAlign={'center'}
      horizontalAlign={'center'}
      className={'h-100 w-100'}
    >
      <Stack.Item grow={0}>
        <Image
          imageFit={ImageFit.contain}
          width={width || 300}
          height={height || 300}
          src={build}
          alt={'Not ready!'}
        />
      </Stack.Item>

      <Text
        styles={{ root: { color: '#0078d7', fontWeight: 600 } }}
        variant={'xxLarge'}
      >
        No content!
      </Text>

      <Text
        className={'pb-10'}
        styles={{ root: { color: 'gray' } }}
        variant={'mediumPlus'}
      >
        This feature is not ready!
      </Text>
    </Stack>
  )
}

export const NoSearchResults = () => {
  return (
    <Stack
      verticalAlign={'center'}
      horizontalAlign={'center'}
      className={'h-100 w-100'}
    >
      <Stack.Item grow={0}>
        <Image
          imageFit={ImageFit.contain}
          width={800}
          height={400}
          src={searching}
          alt={'No results'}
        />
      </Stack.Item>

      <Text
        styles={{ root: { color: '#0078d7', fontWeight: 600 } }}
        variant={'xxLarge'}
      >
        No result found!
      </Text>

      <Text
        className={'pb-10'}
        styles={{ root: { color: 'gray' } }}
        variant={'mediumPlus'}
      >
        Try something else
      </Text>
    </Stack>
  )
}
