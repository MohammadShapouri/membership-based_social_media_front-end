import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import Avatar from "../Avatar/Avatar";
import { client } from "../../utils";
import "./NewCommentBox.css";

export default function NewCommentBox({ postId, onAdd }) {
  const { user } = useContext(UserContext);
  console.log(user, '--')
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await client(`/api/v1/posts/${postId}/comments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      onAdd(data); // push new comment to list
      setText("");
      toast.success("Comment added!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="new-comment-box">
      {user && (
        <Avatar
          size="small"
          src={`http://127.0.0.1:8000${user.profile_picture}`}
        />
      )}
      <textarea
        rows="1"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Posting..." : "Comment"}
      </button>
    </div>
  );
}
