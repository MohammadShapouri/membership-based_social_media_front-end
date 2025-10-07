import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import CONST from '../../constants'
import useWindowSize from '../../hooks/useWindowSize'

import Extra from './Extra'
import Sidebar from './Sidebar'
import TimeLine from './TimeLine'

import './index.css'
import MobileSidebar from '../MobileSidebar'

function Layout({ children }) {
    const size = useWindowSize()
    const location = useLocation()

    // Hide Extra on /settings and /profile/:handle
    const hideExtra = location.pathname.startsWith('/settings')
    return (
        <div className="layout">
            {size.width <= 500 && <MobileSidebar />}
            {size.width > 500 && <Sidebar flat={size.width < CONST.DESKTOP_SIZE} />}
            <TimeLine>{children}</TimeLine>
            {size.width > CONST.TABLET_SIZE && !hideExtra && <Extra />}
        </div>
    )
}

export default Layout
