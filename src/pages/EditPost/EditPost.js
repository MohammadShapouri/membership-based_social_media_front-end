import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { client } from "../../utils";
import "./EditPost.css";

export default function EditPost({ onPostUpdated }) {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useContext(UserContext);

  const [caption, setCaption] = useState("");
  const [isOpenToComment, setIsOpenToComment] = useState(true);
  const [plan, setPlan] = useState(null);

  // Keep existing files and new files separate
  const [existingFiles, setExistingFiles] = useState([]); // API objects
  const [newFiles, setNewFiles] = useState(Array(10).fill(null)); // for user uploads
  const fileInputs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [captionErrors, setCaptionErrors] = useState(null);
  const [filesErrors, setFilesErrors] = useState(null);

  // Fetch post data
  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await client(`/api/v1/posts/${id}/`);
        setCaption(res.caption || "");
        setIsOpenToComment(res.is_open_to_comment);
        setPlan(res.plan || null);
        setExistingFiles(res.files || []); // always keep these
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    }
    fetchPost();
  }, [id]);

  const handleFileChange = (index, file) => {
    const updated = [...newFiles];
    updated[index] = file;
    setNewFiles(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("is_open_to_comment", isOpenToComment);
    if (plan) formData.append("plan", plan); // read-only on server anyway

    // Only append slots where user uploaded new files
    newFiles.forEach((file) => {
      if (file) formData.append("files", file);
    });

    try {
      const res = await client(`/api/v1/posts/${id}/`, {
        method: "PATCH",
        body: formData,
      });

      if (res.id) {
        if (onPostUpdated) onPostUpdated(res);
        history.push(`/post/${id}`);
      } else {
        setErrors(res);
      }
    } catch (err) {
      console.error(err);
      if (err.caption) setCaptionErrors(err.caption);
      if (err.files) setFilesErrors(err.files);
      setErrors({ non_field_errors: ["Something went wrong."] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>Edit Post</h2>

      {/* Caption */}
      <div className="form-group">
        <label>Caption</label>
        <textarea
          value={caption}
          maxLength={1500}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Update your caption..."
        />
        <div className="caption-info">
          <span className="char-counter">{caption.length}/1500</span>
        </div>
        {captionErrors && <p className="error">{captionErrors}</p>}
      </div>

      {/* Comments toggle */}
      <div className="form-group checkbox-group">
        <label className="custom-checkbox">
          <input
            type="checkbox"
            checked={isOpenToComment}
            onChange={(e) => setIsOpenToComment(e.target.checked)}
          />
          <span className="checkmark"></span>
          Allow Comments
        </label>
      </div>

      {/* Plan (locked) */}
      <div className="form-group">
        <label>Plan (cannot be changed)</label>
        <select value={plan?.id || ""} disabled>
          <option value="">
            {plan ? `${plan.name} (${plan.effective_price} $)` : "Free"}
          </option>
        </select>
      </div>

      {/* File slots */}
      <div className="form-group">
        <label>Files (max 10)</label>
        <div className="file-grid">
            {Array.from({ length: 10 }).map((_, i) => {
            const existingFile = existingFiles[i];
            const newFile = newFiles[i];

            return (
                <div key={i} className="file-slot">
                <input
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    ref={(el) => (fileInputs.current[i] = el)}
                    onChange={(e) => handleFileChange(i, e.target.files[0])}
                />

                {(newFile || existingFile) && (
                    <div className="preview">
                    {newFile ? (
                        newFile.type.startsWith("image/") ? (
                        <img src={URL.createObjectURL(newFile)} alt={`preview-${i}`} />
                        ) : (
                        <video src={URL.createObjectURL(newFile)} controls />
                        )
                    ) : existingFile ? (
                        existingFile.file.endsWith(".mp4") ||
                        existingFile.file.endsWith(".mov") ? (
                        <video
                            src={"http://127.0.0.1:8000" + existingFile.file}
                            controls
                        />
                        ) : (
                        <img
                            src={"http://127.0.0.1:8000" + existingFile.file}
                            alt={`file-${existingFile.id}`}
                        />
                        )
                    ) : null}
                    <p className="file-name">
                        {newFile ? newFile.name : existingFile ? `File #${existingFile.id}` : ""}
                    </p>
                    </div>
                )}

                {/* Button logic */}
                {!existingFile && !newFile && (
                    <button
                    type="button"
                    className="add-file-btn"
                    onClick={() => fileInputs.current[i]?.click()}
                    >
                    +
                    </button>
                )}
                {newFile && (
                    <button
                    type="button"
                    className="add-file-btn filled"
                    onClick={() => fileInputs.current[i]?.click()}
                    >
                    Change
                    </button>
                )}
                </div>
            );
            })}
        </div>
        {filesErrors && <p className="error">{filesErrors}</p>}
      </div>

      <button type="submit" disabled={loading} className="create-post-btn">
        {loading ? "Updating..." : "Update Post"}
      </button>
    </form>
  );
}
