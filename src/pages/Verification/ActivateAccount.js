import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import ThemeButton from '../../components/ThemeButton/ThemeButton'
import TextTitle from '../../components/Text/title'
import AppLogo from '../../components/icons/AppLogo';
import Button from '../../components/Button/Button'
import { client } from '../../utils'

function ActivateAccount({ }) {
    const [loading, setLoading] = useState(false)
    const history = useHistory();

    useEffect(() => {
        const searchParams = new URLSearchParams(history.location.search);
        const uid = searchParams.get('uid');
        const token = searchParams.get('token');

        if (!uid || !token) {
            toast.error("Invalid activation link");
            setLoading(false);
            return;
        }

        const activateAccount = async () => {
        try {
            // Call backend verify link
            const response = await client(`/api/v1/verify-account?uid=${uid}&token=${token}`, { method: "GET" });

            if (response.success) {
                toast.success("Account activated successfully!");
                history.push('/'); // Redirect to login page
            } else {
                toast.error(response.message || "Activation failed. Request new link using login page.");
            }
        } catch (err) {
            console.log(err);
            toast.error("Activation failed.");
        } finally {
            setLoading(false);
        }
        };

        activateAccount();
    }, [history]);

    return (
        <div className="auth-page__container">
            <div>
                <div className="auth-page__logo">
                    <Button icon><AppLogo /></Button>
                </div>
                <TextTitle title style={{ fontSize: "23px", marginBottom: "5px" }}>Social Media</TextTitle>

                <h3>Validating Link...</h3>
            </div>
        </div>
    )
}

export default ActivateAccount
