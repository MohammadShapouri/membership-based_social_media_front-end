import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import TextTitle from '../../components/Text/title';
import TextBody from '../../components/Text/body';
import Avatar from '../../components/Avatar/Avatar';
import { UserContext } from '../../context/UserContext';
import Button from '../../components/Button/Button';
import { Reply, Like, LikeFill } from '../../components/icons';
import CommentThread from "../../components/CommentThread/CommentThread";
import NewCommentBox from '../../components/NewCommentBox/NewCommentBox';
import { client } from '../../utils';
import './PostDetail.css';



export default function PostDetail() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState({}); // { postId: index }
  const [totalImages, setTotalImages] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [likedState, setLiked] = useState(false);
  const [likesState, setLikes] = useState(0);
  const currentIndex = carouselIndex[post?.id] ?? 0;

  const onLike = () => {};
  const onDislike = () => {};
  const toggleMenu = () => setMenuOpen(prev => !prev);

  const comments = [
    {
      "id": 1,
      "user": user,
      "text": "this is test",
      "likes": 10,
      "dislikes": 0,
      "replies": [
                    {
                      "id": 2,
                      "user": user,
                      "text": "this is reply",
                      "likes": 10,
                      "dislikes": 0,
                      "replies": []
                    }
                  ]
    }
  ]

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

  const handleDelete = async (postId, username) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await client(`/api/v1/posts/${postId}/`, { method: "DELETE" });
      toast.error("Post deleted successfully.");
      window.location.href = `/${username}`;
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post.");
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await client(`/api/v1/posts/${id}/`);
        setPost(data);
        setTotalImages(data.files.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.post-header')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>
    <div className="post-notfound-center">
      <p>Post Not Found</p>
    </div>
  </div>;

  return (
    <div>
      {/* <div key={post.id} className="post-card"> */}
        <div className="posts-section">
          <div key={post.id} className="post-card">
            <div>
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

                {user?.id === post.user_account.id && 
                  <div className="hamburger">
                    <button 
                      className="hamburger-btn" 
                      onClick={toggleMenu}
                    >
                      &#9776; {/* ☰ Unicode hamburger */}
                    </button>

                    {/* Menu popup */}
                    {menuOpen && (
                      <div className="menu-popup">
                        <Link className="hamburger-menu-items" to={`/edit-post/${post.id}`}>Edit</Link>
                        <button
                          className="hamburger-menu-items"
                          onClick={() => { handleDelete(post.id, user.username)}}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                }
              </div>
            </div>
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
        </div>

      {post.is_open_to_comment && (
        <NewCommentBox
          postId={post.id}
          onAdd={(newComment) =>
            setPost((prev) => ({
              ...prev,
              comments: [...(prev.comments || []), newComment],
              comments_count: (prev.comments_count || 0) + 1,
            }))
          }
        />
      )}

        {/* Comments & Replies */}
        <div className="comments-thread-section">
          {comments && comments.length > 0 ? (
            comments.map(c => (
              <CommentThread key={c.id} comment={c} postId={post.id} />
            ))
          ) : (
            <div className="comment-notfound-center">
              <p>No Comment Found</p>
            </div>
          )}
        </div>
    </div>
  );
}
