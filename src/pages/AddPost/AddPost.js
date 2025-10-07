import React, { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from '../../context/UserContext';
import { client } from "../../utils";
import "./AddPost.css";

export default function AddPost({ onPostCreated }) {
  const [caption, setCaption] = useState("");
  const [isOpenToComment, setIsOpenToComment] = useState(true);
  const [plan, setPlan] = useState(null);
  const [files, setFiles] = useState(Array(10).fill(null)); // 10 slots
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [captionErrors, setCaptionErrors] = useState(null);
  const [planErrors, setPlanErrors] = useState(null);
  const [isOpenToCommentErrors, setIsOpenToCommentErrors] = useState(null);
  const [filesErrors, setFilesErrors] = useState(null);
  const [plans, setPlans] = useState([]);
  const fileInputs = useRef([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function fetchPlans() {
      try {
        let url = `/api/v1/plans?user_account=${user.id}`;
        let allPlans = [];

        while (url) {
          const res = await client(url);  // your client should handle relative or absolute URLs
          if (res.results) {
            allPlans = [...allPlans, ...res.results];
            url = res.next; // keep going until null
            if (url) {
              url = url.replace(/^.*?(\/api\/.*)$/, "$1");
            }
          } else {
            // not paginated (just a plain array)
            allPlans = res;
            url = null;
          }
        }
        
        setPlans(allPlans);
      } catch (err) {
        console.error("Failed to load plans", err);
      }
    }
    fetchPlans();
  }, [user.id]);

  const handleFileChange = (index, file) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate at least one file is selected
    const selectedFiles = files.filter((f) => f !== null);
    if (selectedFiles.length === 0) {
      setFilesErrors([{ file: ["At least one file must be uploaded."] }]);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("is_open_to_comment", isOpenToComment);
    if (plan) formData.append("plan", plan);

    // Append files as objects { file: <File> }
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await client("/api/v1/posts/", {
        method: "POST",
        body: formData,
      });

      if (res.id) {
        if (onPostCreated) onPostCreated(res);
        setCaption("");
        setIsOpenToComment(true);
        setPlan(null);
        setFiles(Array(10).fill(null));
        window.location.href = `/${user.username}`;
      } else {
        setErrors(res);
      }
    } catch (err) {
      console.error(err);
      if (err.caption) setCaptionErrors(err.caption);
      if (err.is_open_to_comment) setIsOpenToCommentErrors(err.is_open_to_comment);
      if (err.plan) setPlanErrors(err.plan);
      if (err.files) setFilesErrors(err.files);
      setErrors({ non_field_errors: ["Something went wrong."] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>Create Post</h2>

      <div className="form-group">
        <label>Caption</label>
        <textarea
          value={caption}
          maxLength={1500}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write your caption..."
        />
        <div className="caption-info">
          <span className="char-counter">{caption.length}/1500</span>
        </div>
        {captionErrors && <p className="error">{typeof captionErrors === "string" ? captionErrors : JSON.stringify(captionErrors)}</p>}
      </div>

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
        {isOpenToCommentErrors && <p className="error">{typeof isOpenToCommentErrors === "string" ? isOpenToCommentErrors : JSON.stringify(isOpenToCommentErrors)}</p>}
      </div>

      <div className="form-group">
        <label>Plan (optional)</label>
        <select
          value={plan || ""}
          onChange={(e) => setPlan(e.target.value)}
        >
          <option value="">-- Select a plan --</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {`${p.name} (${p.effective_price} $)` || `Plan ${p.id}`}
            </option>
          ))}
        </select>
        {planErrors && <p className="error">{typeof planErrors === "string" ? planErrors : JSON.stringify(planErrors)}</p>}
      </div>

      {/* Files grid */}
      <div className="form-group">
        <label>Files (up to 10)</label>
        <div className="file-grid">
          {files.map((file, i) => (
            <div key={i} className="file-slot">
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*,video/*"
                style={{ display: "none" }}
                ref={(el) => (fileInputs.current[i] = el)}
                onChange={(e) => handleFileChange(i, e.target.files[0])}
              />

              {/* Preview if file exists */}
              {file && (
                <div className="preview">
                  {file instanceof File ? (
                    // If the slot has a new File object
                    file.type.startsWith("image/") ? (
                      <img src={URL.createObjectURL(file)} alt={`preview-${i}`} />
                    ) : (
                      <video src={URL.createObjectURL(file)} controls />
                    )
                  ) : (
                    // If it's an existing file object from API (optional)
                    file.file.endsWith(".mp4") || file.file.endsWith(".mov") ? (
                      <video src={file.file} controls />
                    ) : (
                      <img src={file.file} alt={`file-${i}`} />
                    )
                  )}
                  <p className="file-name">{file.name || `File #${i + 1}`}</p>
                </div>
              )}

              {/* Always show the + button */}
              <button
                type="button"
                className={file ? "add-file-btn filled" : "add-file-btn"}
                onClick={() => fileInputs.current[i]?.click()}
              >
                {file ? "Change" : "+"}
              </button>
            </div>
          ))}
        </div>
        {filesErrors && (
          <p className="error">
            {Array.isArray(filesErrors)
              ? filesErrors
                  .map((item) => Object.values(item).flat())
              : typeof filesErrors === "string"
              ? filesErrors
              : JSON.stringify(filesErrors)}
          </p>
        )}
      </div>

      {errors.non_field_errors && (
        <p className="error">{errors.non_field_errors}</p>
      )}

      <button type="submit" disabled={loading} className="create-post-btn">
        {loading ? "Posting..." : "Create Post"}
      </button>
    </form>
  );
}
