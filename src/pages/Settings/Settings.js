import React, { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import Header from "../../components/Header/Header";
import TextTitle from "../../components/Text/title";
import { ThemeContext } from "../../context/ThemeContext";
import ThemeButton from "../../components/ThemeButton/ThemeButton";
import Button from "../../components/Button/Button";
import "./Settings.css";

const THEME = {
  light: "Light",
  dim: "Dim",
  dark: "Dark",
};

function Settings() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [activeCategory, setActiveCategory] = useState("General");
  const [activeItem, setActiveItem] = useState("Theme");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);

  const changeTheme = (theme) => {
    setTheme(theme);
    localStorage.setItem("THEME", theme);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = {
    General: ["Theme", "Language"],
    Account: ["Account Profile", "Password", "Financial", "Block List"],
    Preferences: ["Email Notifications", "New Follower Notification", "Subscription Expiration Notification"],
  };

  const renderDetail = () => {
    if (activeItem === "Theme") {
      return (
        <div className="detail-box">
          <TextTitle xbold>Theme</TextTitle>
          <div className="theme-options">
            {["light", "dim", "dark"].map((th) => (
              <ThemeButton
                key={th}
                primary={th === theme}
                checked={th === theme}
                name="theme"
                onClick={() => changeTheme(th)}
              >
                {THEME[th]}
              </ThemeButton>
            ))}
          </div>
        </div>
      );
    }

    if (activeItem === "Language") {
      return (
        <div className="detail-box">
          <TextTitle xbold>Language</TextTitle>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option value="en">English</option>
            <option value="fa">فارسی</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
      );
    }

    if (activeItem === "Email Notifications") {
      return (
        <div className="detail-box">
          <TextTitle xbold>Email Notifications</TextTitle>
          <label className="toggle">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider"></span>
          </label>
        </div>
      );
    }

    if (activeItem === "New Follower Notification") {
      return (
        <div className="detail-box">
          <TextTitle xbold>New Follower Notification</TextTitle>
          <label className="toggle">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider"></span>
          </label>
        </div>
      );
    }

    if (activeItem === "Subscription Expiration Notification") {
      return (
        <div className="detail-box">
          <TextTitle xbold>Subscription Expiration Notification</TextTitle>
          <label className="toggle">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider"></span>
          </label>
        </div>
      );
    }

    if (activeItem === "Password") {
      return (
        <div>
          <div className="detail-box">
            <TextTitle xbold>Change Password</TextTitle>
            <Button>Change Password</Button>
          </div>
          <div className="detail-box">
            <TextTitle xbold>Reset Password</TextTitle>
            <Button>Change Password</Button>
          </div>
        </div>
      );
    }

    if (activeItem == "Financial") {
      return (
        <div>
          <div className="detail-box">
            <Link to="/manage-plan">
              <TextTitle xbold>Manage Plans</TextTitle>
              <Button>Manage, Add or Remove Plans</Button>
            </Link>
          </div>
          <div className="detail-box">
            <Link to="">
              <TextTitle xbold>Manage Wallet Address</TextTitle>
              <Button>Manage Your Wallet Address</Button>
            </Link>
          </div>
          <div className="detail-box">
            <Link to="">
              <TextTitle xbold>Account Financial Status and History</TextTitle>
              <Button>Show Detail</Button>
            </Link>
          </div>
        </div>
      );
    }

    if (activeItem === "Account Profile") {
      return (
        <div>
          <div className="detail-box">
            <Link to="/accounts/edit">
              <TextTitle xbold>Update Account Profile</TextTitle>
              <Button>Update</Button>
            </Link>
          </div>
        </div>
      );
    }

    if (activeItem === "Block List") {
      return (
        <div className="detail-box">
          <Link to='/block-list/'>
            <TextTitle xbold>Block List</TextTitle>
            <Button>Manage your block list.</Button>
          </Link>
        </div>
      );
    }

    return <div className="detail-box">Select a Setting</div>;
  };

  return (
    <>
      <Header border>
        <TextTitle xbold>Settings</TextTitle>
      </Header>
      <div className="settings-container">
        {/* Left Column - Categories */}
        <div className="settings-column categories">
          {Object.keys(categories).map((cat) => (
            <div
              key={cat}
              className={`category-item ${
                activeCategory === cat ? "active" : ""
              }`}
              onClick={() => {
                setActiveCategory(cat);
                setActiveItem(categories[cat][0]);
              }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Middle Column - Items */}
        <div className="settings-column items">
          {categories[activeCategory].map((item) => (
            <div
              key={item}
              className={`item ${activeItem === item ? "active" : ""}`}
              onClick={() => setActiveItem(item)}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Right Column - Detail */}
        <div className="settings-column details">{renderDetail()}</div>
      </div>
    </>
  );
}

export default Settings;
