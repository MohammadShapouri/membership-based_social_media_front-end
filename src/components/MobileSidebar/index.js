import React, { useContext } from 'react'
import { useLocation as locations } from "react-router-dom";

import { Home, Search, HomeFill, ProfileFill, Profile, ListsFill, Lists, Notification, Messages, More } from '../icons'
import Button from '../Button/Button'

import './style.css'
import { UserContext } from '../../context/UserContext';

function MobileSidebar() {
    let router = locations();
    const { user, loading } = useContext(UserContext);
    if (loading || !user) return null;


    return (
        <div className='mobile-sidebar'>
            <Button gray icon href={user ? '/' : '/login'}>
                {router.pathname === user ? '/' : '/login' ? <HomeFill className='s-selected' /> : <Home />}
            </Button>
            <Button gray icon href={user ? '/explore' : '/login'}>
                {router.pathname === user ? '/explore' : '/login' ? <Search className='s-selected' /> : <Search />}
            </Button>
            <Button gray icon href={user ? '/notifications' : '/login'}>
                {router.pathname === user ? '/notifications' : '/login' ? <Notification className='s-selected' /> : <Notification />}
            </Button>
            <Button gray icon href={user ? '/messages' : '/login'}>
                {router.pathname === user ? '/messages' : '/login' ? <Messages className='s-selected' /> : <Messages />}
            </Button>
            <Button gray icon href={user ? '/subscriptions' : '/login'}>
                {router.pathname === user ? '/subscriptions' : '/login' ? <Lists className='s-selected' /> : <Lists />}
            </Button>
            <Button gray icon href={user ? `/${user.username}` : '/login'}>
                {router.pathname === user ? `/${user.username}` : '/login' ? <Profile className='s-selected' /> : <Profile />}
            </Button>
            <Button gray icon href={user ? `/more` : '/login'}>
                {router.pathname === user ? `/more` : '/login' ? <More className='s-selected' /> : <More />}
            </Button>
        </div>
    )
}

export default MobileSidebar
