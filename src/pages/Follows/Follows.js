import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { client } from '../../utils';
import Avatar from '../../components/Avatar/Avatar';
import Loading from '../../components/loading';
import TextTitle from '../../components/Text/title';
import TextBody from '../../components/Text/body';
import ThemeButton from '../../components/ThemeButton/ThemeButton';
import SearchBox from '../../components/SearchBox/SearchBox';

import './Follows.css'

function Follows() {
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const type = query.get('type'); // 'follower' or 'following'

  const [loading, setLoading] = useState(true);
  const [accessRestricted, setAccessRestricted] = useState(false);
  const [users, setUsers] = useState([]);
  const [nextUrl, setNextUrl] = useState(null); // for pagination
  const [searchText, setSearchText] = useState("");

  const handleRemove = async (connectionId) => {
    try {
      await client(`/api/v1/follower-followings/${connectionId}/`, { method: "DELETE" });
      setUsers(prev => prev.filter(u => u.id !== connectionId));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFollowDetail = async (url = null, append = false) => {
    setLoading(true);
    try {
      let res = null;
      const baseUrl = url || (type === "following"
        ? `/api/v1/follower-followings?following=${id}`
        : `/api/v1/follower-followings?follower=${id}`);
      const queryParam = searchText ? `&search=${encodeURIComponent(searchText)}` : '';
      res = await client(`${baseUrl}${url ? '' : queryParam}`);
      
      var next = null
      if (res.next) {
        next = res.next.replace(/^.*?(\/api\/.*)$/, "$1")
      }
      setNextUrl(next);
      setUsers(prev => append ? [...prev, ...res.results] : res.results);
    } catch (err) {
      if (err.detail) setAccessRestricted(true);
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddSearch = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await fetchFollowDetail(); // new search replaces list
    }
  }

  const handleLoadMore = async () => {
    if (nextUrl) {
      await fetchFollowDetail(nextUrl, true); // append new users
    }
  }

  useEffect(() => {
    fetchFollowDetail();
  }, [id, type]);

  if (loading) return <Loading />;

  if (accessRestricted) {
    return (
      <div>
        <div className="follows-page-header">
          <TextTitle xbold className="follows-page-title">
            {type === 'follower' ? 'Followers' : 'Following'}
          </TextTitle>
        </div>
        <div className="follows-empty">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="rgba(29, 161, 242, 0.6)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 00-6 0v2c0 1.657 1.343 3 3 3zM5 11h14v10H5V11z"/>
          </svg>
          <h2>This account is private</h2>
          <p>You must be an accepted follower to view this data.</p>
        </div>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div>
        <div className="follows-page-header">
          <TextTitle xbold className="follows-page-title">
            {type === 'follower' ? 'Followers' : 'Following'}
          </TextTitle>
          <SearchBox
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            onKeyPress={handleAddSearch}
            className="layout-explore--search"
          />
        </div>
        <div className="follows-empty">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="rgba(29, 161, 242, 0.6)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v6m0 0v6m0-6h6m-6 0H2"/>
          </svg>
          <h2>No users found</h2>
          <p>Looks like this list is empty for now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="follows-page">
      <div className="follows-page-header">
        <TextTitle xbold className="follows-page-title">
          {type === 'follower' ? 'Followers' : 'Following'}
        </TextTitle>
        <SearchBox
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          onKeyPress={handleAddSearch}
          className="layout-explore--search"
        />
      </div>
      <div className="follows-list">
        {users.map(item => {
          const userObj = type === 'follower' ? item.follower : item.following;

          return (
            <div key={`${item.id}-${type}`} className="follows-item">
              <Link to={`/${userObj.username}`} className="follows-info-link">
                <Avatar
                  size="medium"
                  src={userObj.profile_picture ? "http://127.0.0.1:8000" + userObj.profile_picture : "/default-avatar.png"}
                />
                <div className="follows-info">
                  <TextTitle>{userObj.full_name}</TextTitle>
                  <TextBody gray>@{userObj.username}</TextBody>
                </div>
              </Link>
              <ThemeButton size='medium' onClick={() => handleRemove(item.id)}>Remove</ThemeButton>
            </div>
          );
        })}

        {/* Load More button */}
        {nextUrl && (
          <div key="load-more" className="follows-load-more">
            <ThemeButton size="medium" primary onClick={handleLoadMore}>+ More</ThemeButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default Follows;
