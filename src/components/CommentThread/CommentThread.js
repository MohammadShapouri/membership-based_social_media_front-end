// components/Post/CommentThread.js
import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import Avatar from "../Avatar/Avatar";
import TextTitle from "../Text/title";
import TextBody from "../Text/body";
import { UserContext } from "../../context/UserContext";
import { client } from "../../utils";
import { Like, LikeFill } from '../icons';
import "./CommentThread.css";

export default function CommentThread({ comment, postId, depth = 0 }) {
  const { user } = useContext(UserContext);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [localReplies, setLocalReplies] = useState(comment.replies || []);
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const newReply = await client(`/api/v1/posts/${postId}/comments/${comment.id}/reply/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: replyText }),
      });
      setLocalReplies([...localReplies, newReply]);
      setReplyText("");
      setShowReply(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-thread" style={{ marginLeft: depth * 20 }}>
      {/* comment header */}
      <Link to={`/${comment.user.username}`}>
        <div className="comment-header">
          <Avatar size="small" src={`http://127.0.0.1:8000${comment.user.profile_picture}`} />
          <div className="comment-user-info">
            <TextTitle>{comment.user.full_name || comment.user.username}</TextTitle>
            <TextBody>@{comment.user.username}</TextBody>
          </div>
        </div>
      </Link>

      {/* text */}
      <TextBody className="comment-text">{comment.text}</TextBody>

      {/* actions */}
      <div className="comment-actions">
        <button className="reply-btn" onClick={() => setShowReply(!showReply)}>
          {showReply ? "Cancel" : "Reply"}
        </button>
        <Like />
      </div>

      {/* reply input */}
      {showReply && (
        <div className="reply-form">
          <textarea
            rows="1"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button disabled={submitting} onClick={handleReply}>
            {submitting ? "Posting..." : "Reply"}
          </button>
        </div>
      )}

      {/* recursive replies */}
      {localReplies.length > 0 && (
        <div className="comment-replies">
          {localReplies.map(r => (
            <CommentThread key={r.id} comment={r} postId={postId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
