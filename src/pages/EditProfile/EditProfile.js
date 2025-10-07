import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import { UserContext } from '../../context/UserContext'
import Label from '../../components/Label/Label'
import Header from '../../components/Header/Header'
import TextTitle from '../../components/Text/title'
import SearchBox from '../../components/SearchBox/SearchBox'
import ThemeButton from '../../components/ThemeButton/ThemeButton'
import Avatar from '../../components/Avatar/Avatar'
import { client } from '../../utils'

import './EditProfile.css'

function EditProfile() {
  const history = useHistory()
  const { user, setUser } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user.full_name)
  const [username, setUsername] = useState(user.username)
  const [email, setEmail] = useState(user.email)
  const [isPrivate, setIsPrivate] = useState(!!user.is_private);

  // pictures from db
  const [profilePic, setProfilePic] = useState(user.profile_picture)
  const [bgPic, setBgPic] = useState(user.background_picture)
  const [errors, setErrors] = useState({});

  // previews
  const [profilePreview, setProfilePreview] = useState(null)
  const [bgPreview, setBgPreview] = useState(null)

  useEffect(() => {
    setProfilePreview(user.profile_picture ? "http://127.0.0.1:8000" + user.profile_picture : null)
    setBgPreview(user.background_picture ? "http://127.0.0.1:8000" + user.background_picture : null)
  }, [user])

  const handleImageChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      if (type === "profile") {
        setProfilePic(file)
        setProfilePreview(previewUrl)
      } else {
        setBgPic(file)
        setBgPreview(previewUrl)
      }
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!fullName) {
      return toast.error("The name field should not be empty");
    }
    if (!username) {
      return toast.error("The username field should not be empty");
    }
    if (!email) {
      return toast.error("The email field should not be empty");
    }

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("is_private", isPrivate);
    if (profilePic instanceof File) formData.append("profile_picture", profilePic);
    if (bgPic instanceof File) formData.append("background_picture", bgPic);

    setLoading(true);
    try {
      const res = await client(`/api/v1/users/${user.id}/`, {
        method: "PUT",
        body: formData,
      });
      if (!res.is_new_email_verified) {
        toast.success("Please check you emails for verifying new email address.");
      }
      history.push(`/${user.username}`);
    } catch (err) {
      console.log(err);
      if (err.username || err.email || err.username || err.first_name || err.background_picture || err.profile_picture) {
        setErrors(err);  // store the whole error object
      }
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header border>
        <TextTitle xbold>Edit Profile</TextTitle>
      </Header>

      {/* Background preview */}
      <div className="edit-profile__background">
        {bgPreview && <img src={bgPreview} alt="Background Preview" />}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e, "background")}
        />
        {errors.background_picture && (
          <span style={{ color: "red", fontSize: "12px" }}>{errors.background_picture}</span>
        )}
      </div>
      <div className="edit-profile__container">
        {/* Profile picture preview */}
        <div className="edit-profile__avatar">
          <Avatar size="xlarge" border src={profilePreview} />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "profile")}
          />
          {errors.profile_picture && (
            <span style={{ color: "red", fontSize: "12px" }}>{errors.profile_picture}</span>
          )}
        </div>

        <div className="edit-profile__fields">
          <div className="edit-profile__fields-row">
            <div className="edit-profile__field">
              <Label htmlFor="fullName">Full Name</Label>
              <SearchBox
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={false}
                text="Full Name"
              />
              {errors.full_name && (
                <span style={{ color: "red", fontSize: "12px" }}>{errors.full_name}</span>
              )}
            </div>

            <div className="edit-profile__field">
              <Label htmlFor="username">Username</Label>
              <SearchBox
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={false}
                text="Username"
              />
              {errors.username && (
                <span style={{ color: "red", fontSize: "12px" }}>{errors.username}</span>
              )}
            </div>
          </div>

          <div className="edit-profile__fields-row">
            <div className="edit-profile__field">
              <Label htmlFor="email">Email</Label>
              <SearchBox
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={false}
                text="Email"
              />
              {errors.email && (
                <span style={{ color: "red", fontSize: "12px" }}>{errors.email}</span>
              )}
            </div>
            <div className="edit-profile__field">
              <Label htmlFor="isPrivate">Private Account</Label>
              <select
                className="is-private_select"
                id="isPrivate"
                value={isPrivate ? "true" : "false"}
                onChange={(e) => setIsPrivate(e.target.value === "true")}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </div>

        <ThemeButton className="update-button" primary onClick={handleEdit}>
          Update
        </ThemeButton>
      </div>
    </div>
  )
}

export default EditProfile
