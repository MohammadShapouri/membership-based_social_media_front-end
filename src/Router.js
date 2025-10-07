import React, { useContext, useEffect } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Profile from './pages/Profile/Profile';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/Layout';
import Auth from './components/Auth/Auth';
import Home from './pages/Home/Home';
import More from './pages/More/More';
import Settings from './pages/Settings/Settings';
import EditProfile from './pages/EditProfile/EditProfile';
import Explore from './pages/Explore/Explore';
import Notifications from './pages/Notifications/Notifications';
import Bookmarks from './pages/Bookmarks/Bookmarks';
import TweetDetail from './pages/TweetDetail/TweetDetail';
import Lists from './pages/Lists/Lists';
import ActivateAccount from './pages/Verification/ActivateAccount';
import VerifyEmail from './pages/Verification/VerifyEmail';
import { FeedContext } from './context/FeedContext';
import { client } from './utils';
import Follows from './pages/Follows/Follows';
import Blocklist from './pages/Blocklist/Blocklist';
import ManagePlans from './pages/ManagePlans/ManagePlans';
import AddPlan from './pages/AddPlan/AddPlan';
import EditPlan from './pages/EditPlan/EditPlan';
import PostDetail from './pages/PostDetail/PostDetail';
import AddPost from './pages/AddPost/AddPost';
import EditPost from './pages/EditPost/EditPost';
import UserSubscriptions from './pages/UserSubscriptions/UserSubscriptions';
import PlanSubscribers from './pages/PlanSubscribers/PlanSubscribers';

function Router() {

    const { setWhoFollow, setTags } = useContext(FeedContext);

    useEffect(() => {

        client("/users")
            .then((response) => {
                setWhoFollow(response.data.filter((user) => !user.isFollowing));
            });


        client("/posts/tags")
            .then((response) => {
                setTags(response.data);
            });


    }, [])

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={`/verify-account`} component={ActivateAccount} />
                <Route exact path="/login" component={Auth} />
                <Route exact path="/signup" component={Auth} />
                <Layout>
                    <Switch>
                        <ProtectedRoute path="/accounts/edit" component={EditProfile} />
                        <ProtectedRoute exact path={`/verify-email`} component={VerifyEmail} />
                        <ProtectedRoute exact path={`/settings`} component={Settings} />
                        <ProtectedRoute exact path="/follows/:id" component={Follows} />
                        <ProtectedRoute exact path="/block-list" component={Blocklist} />
                        <ProtectedRoute exact path="/manage-plan" component={ManagePlans} />
                        <ProtectedRoute exact path="/add-plan" component={AddPlan} />
                        <ProtectedRoute exact path="/edit-plan" component={EditPlan} />
                        <ProtectedRoute exact path="/post/:id" component={PostDetail} />
                        <ProtectedRoute exact path="/create-post" component={AddPost} />
                        <ProtectedRoute exact path="/edit-post/:id" component={EditPost} />
                        <ProtectedRoute exact path="/user-subscriptions" component={UserSubscriptions} />
                        <ProtectedRoute exact path="/plan-subscribers/:planId" component={PlanSubscribers} />

                        <ProtectedRoute exact path="/" component={Home} />
                        <ProtectedRoute exact path="/more" component={More} />
                        <ProtectedRoute exact path="/explore" component={Explore} />
                        <ProtectedRoute exact path="/lists" component={Lists} />
                        <ProtectedRoute exact path="/notifications" component={Notifications} />
                        <ProtectedRoute exact path="/bookmarks" component={Bookmarks} />

                        <ProtectedRoute exact path={`/:handle`} component={Profile} />
                        <ProtectedRoute
                            exact
                            path={`/:handle/status/:tweetId`}
                            component={TweetDetail}
                        />
                        <Redirect from="*" to="/" />
                    </Switch>
                </Layout>
            </Switch>
        </BrowserRouter>
    )
}

export default Router
