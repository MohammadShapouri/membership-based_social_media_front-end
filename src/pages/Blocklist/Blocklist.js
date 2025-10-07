import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { client } from '../../utils';
import Avatar from '../../components/Avatar/Avatar';
import Loading from '../../components/loading';
import TextTitle from '../../components/Text/title';
import TextBody from '../../components/Text/body';
import ThemeButton from '../../components/ThemeButton/ThemeButton';
import SearchBox from '../../components/SearchBox/SearchBox';

import './Blocklist.css'
import { toast } from 'react-toastify';

function Blocklist() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [nextUrl, setNextUrl] = useState(null); // for pagination
  const [searchText, setSearchText] = useState("");

  const handleRemove = async (connectionId) => {
    try {
      await client(`/api/v1/blocklists/${connectionId}/`, { method: "DELETE" });
      setUsers(prev => prev.filter(u => u.id !== connectionId));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFollowDetail = async (url = null, append = false) => {
    setLoading(true);
    try {
      let res = null;
      const baseUrl = url || `/api/v1/blocklists`;
      const queryParam = searchText ? `?search=${encodeURIComponent(searchText)}` : '';
      res = await client(`${baseUrl}${url ? '' : queryParam}`);
      
      var next = null
      if (res.next) {
        next = res.next.replace(/^.*?(\/api\/.*)$/, "$1")
      }
      setNextUrl(next);
      setUsers(prev => append ? [...prev, ...res.results] : res.results);
    } catch (err) {
      toast.error("Failed to load block list.")
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
  }, [id]);

  if (loading) return <Loading />;

  if (!users.length) {
    return (
      <div>
        <div className="block-list-page-header">
          <TextTitle xbold className="block-list-page-title">
            Block List
          </TextTitle>
          <SearchBox
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            onKeyPress={handleAddSearch}
            className="layout-explore--search"
          />
        </div>
        <div className="block-list-empty">
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
    <div className="block-list-page">
      <div className="block-list-page-header">
        <TextTitle xbold className="block-list-page-title">
          Block List
        </TextTitle>
        <SearchBox
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          onKeyPress={handleAddSearch}
          className="layout-explore--search"
        />
      </div>
      <div className="block-list-list">
        {users.map(item => {
          const userObj = item.blocked;

          return (
            <div key={`${item.id}`} className="block-list-item">
              <Link to={`/${userObj.username}`} className="block-list-info-link">
                <Avatar
                  size="medium"
                  src={userObj.profile_picture ? "http://127.0.0.1:8000" + userObj.profile_picture : "/default-avatar.png"}
                />
                <div className="block-list-info">
                  <TextTitle>{userObj.full_name}</TextTitle>
                  <TextBody gray>@{userObj.username}</TextBody>
                </div>
              </Link>
              <ThemeButton size='medium' onClick={() => handleRemove(item.id)}>Unblock</ThemeButton>
            </div>
          );
        })}

        {/* Load More button */}
        {nextUrl && (
          <div key="load-more" className="block-list-load-more">
            <ThemeButton size="medium" primary onClick={handleLoadMore}>+ More</ThemeButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blocklist;
