import React from 'react'

import './ProfileBox.css'
import { ArrowBottom } from '../icons'
import Button from '../Button/Button'
import TextBody from '../Text/body'
import Avatar from '../Avatar/Avatar'

function ProfileBox({ flat = false, user }) {
    if (!user) return null; // do not render if user is missing

    return (
        <Button className="profil-box">
            <Avatar src={"http://127.0.0.1:8000" + user.profile_picture}/>
            {!flat && (
                <>
                    <div className="profil-box__body">
                        <TextBody bold>{user.full_name}</TextBody>
                        <TextBody className="profil-box__slug">@{user.username.slice(0, 10)}</TextBody>
                    </div>
                    <ArrowBottom className="profil-box__icon" />
                </>
            )}
        </Button>
    )
}

export default ProfileBox
