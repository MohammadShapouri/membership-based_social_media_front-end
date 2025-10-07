import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TextTitle from '../../components/Text/title';
import TextBody from '../../components/Text/body';
import Avatar from '../../components/Avatar/Avatar';
import Button from '../../components/Button/Button';
import { Reply, Like, LikeFill } from '../icons';

import './Post.css';

export default function Post({ posts, currentUser}) {
  const [carouselIndex, setCarouselIndex] = useState({}); // { postId: index }
  const [likedState, setLiked] = useState(false);
  const [likesState, setLikes] = useState(0);

  const onLike = () => {};
  const onDislike = () => {};

  if (!posts || posts.length === 0) {
    return (
      <div className="no-posts-center">
        <TextBody>No posts found</TextBody>
      </div>
    );
  }

  // Helper function to format creation date
  const getPostDateText = (createdAt) => {
    const postDate = new Date(createdAt);
    const now = new Date();

    // Difference in days
    const diffTime = now - postDate; // in milliseconds
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays <= 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    // else show yyyy.mm.dd
    const yyyy = postDate.getFullYear();
    const mm = String(postDate.getMonth() + 1).padStart(2, "0");
    const dd = String(postDate.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };


  const prevImage = (postId, totalImages) => {
    setCarouselIndex(prev => ({
      ...prev,
      [postId]: ((prev[postId] ?? 0) - 1 + totalImages) % totalImages
    }));
  };

  const nextImage = (postId, totalImages) => {
    setCarouselIndex(prev => ({
      ...prev,
      [postId]: ((prev[postId] ?? 0) + 1) % totalImages
    }));
  };

  return (
    <div className="posts-tab-section">
      {posts.map(post => {
        const totalImages = post.files.length;
        const currentIndex = carouselIndex[post.id] || 0;

        return (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <Link to={`/${post.user_account.username}`}>
              <div className="user-info-side">
                <Avatar size="medium" src={`http://127.0.0.1:8000${post.user_account.profile_picture}`} />
                <div className="post-user-info">
                  <TextTitle>{post.user_account.full_name ?? post.user_account.username}</TextTitle>
                  <TextBody>@{post.user_account.username}</TextBody>
                </div>
              </div>
            </Link>
          </div>

          <Link to={`/post/${post.id}`}>
            <div className="post-caption">
              <TextBody>{post.caption}</TextBody>
            </div>
              {totalImages > 0 && (
                <div className="post-carousel">
                  {totalImages > 1 && (
                    <button className="carousel-btn left" onClick={(e) => { e.preventDefault(); prevImage(post.id, totalImages); }}>&lt;</button>
                  )}
                  <div className="carousel-image-wrapper">
                    <img
                      src={`http://127.0.0.1:8000${
                        post.has_plan || post.is_owner
                          ? post.files[currentIndex].file
                          : post.files[currentIndex].blurred_file
                      }`}
                      alt={`Post ${currentIndex + 1}`}
                      className="post-image"
                    />
                  </div>
                  {totalImages > 1 && (
                    <button className="carousel-btn right" onClick={(e) => { e.preventDefault(); nextImage(post.id, totalImages); }}>&gt;</button>
                  )}
                </div>
              )}
          </Link>
          <div className="page-tweet__body--stats status-container">
            <div>
              <div>
                <Button icon href={``}>
                  <Reply />
                  <TextBody className="comments-stat">
                    {post.is_open_to_comment
                      ? `${post.comments_count || 0} comments`
                      : "Closed"}
                  </TextBody>
                </Button>
              </div>
              <div className={likedState ? "isLiked" : ""}>
                <Button icon onClick={null}>
                  {likedState ? <LikeFill /> : <Like />}
                  <TextBody className="comments-stat">{likesState}</TextBody>
                </Button>
              </div>
            </div>
            <div className="date-container">
              <span className="post-date">{getPostDateText(post.creation_date)}</span>
            </div>
          </div>
        </div>
        );
        })}
    </div>
  );
}
