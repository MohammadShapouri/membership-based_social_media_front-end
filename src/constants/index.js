import React, { useContext } from 'react'
import * as Icon from '../components/icons'
import AppLogo from '../components/icons/AppLogo';

export const MENU = (user) => {
  return [
    {
      key: 'app',
      path: !!user ? '/' : '/login',
      icon: <AppLogo height="75px" />,
      iconSelected: <AppLogo height="75px" />,
      title: '',
      notify: 0
    },
    {
      key: 'home',
      path: !!user ? '/' : '/login',
      icon: <Icon.Home />,
      iconSelected: <Icon.HomeFill />,
      title: 'Home',
      notify: 0
    },
    {
      key: 'explore',
      path: !!user ? '/explore' : '/login',
      icon: <Icon.Explore />,
      iconSelected: <Icon.ExplorerFill />,
      title: 'Explore',
      notify: 0
    },
    {
      key: 'notifications',
      path: !!user ? '/notifications' : '/login',
      icon: <Icon.Notification />,
      iconSelected: <Icon.NotificationFill />,
      title: 'Notifications',
      notify: 0
    },
    {
      key: 'messages',
      path: !!user ? '/messages' : '/login',
      icon: <Icon.Messages />,
      iconSelected: <Icon.MessagesFill />,
      title: 'Messages',
      notify: 0
    },
    {
      key: 'subscriptions',
      path: !!user ? '/user-subscriptions' : '/login',
      icon: <Icon.Lists />,
      iconSelected: <Icon.ListsFill />,
      title: 'Subscriptions',
      notify: 0
    },
    {
      key: 'profile',
      path: !!user ? `/${user.username}` : '/login',
      icon: <Icon.Profile />,
      iconSelected: <Icon.ProfileFill />,
      title: 'Profile',
      notify: 0
    },
    {
      key: 'more',
      path: !!user ? '/more' : '/login',
      icon: <Icon.More />,
      iconSelected: <Icon.More />,
      title: 'More',
      notify: 0
    }
  ]
}

export default {
  MOBILE_SIZE: 500,
  TABLET_SIZE: 980,
  DESKTOP_SIZE: 1270
}
