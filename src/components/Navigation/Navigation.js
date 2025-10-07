import React, { useContext } from 'react'
import { useLocation as locations } from "react-router-dom";

import './Navigation.css'

import NavButton from './Button'
import TextTitle from '../Text/title'
import { UserContext } from '../../context/UserContext';
import { MENU } from '../../constants'

function Navigation({ flat }) {
    let router = locations();
    const { user, loading } = useContext(UserContext);

    if (loading) {
    return <nav className="nav">Loading...</nav>; 
    }
    return (
        <nav className="nav">
            {MENU(user).map((menu) => {
                const showTitle = !flat && menu.title.length > 0
                const selected = router.pathname === menu.path

                return (
                    <NavButton
                        key={menu.key}
                        notify={menu.notify}
                        selected={selected}
                        href={menu.path}
                        className={["navButton", menu.key].join(" ")}
                    >
                        {selected ? menu.iconSelected : menu.icon}
                        {showTitle && <TextTitle>{menu.title}</TextTitle>}
                    </NavButton>
                )
            })}
        </nav>
    )
}

export default Navigation
