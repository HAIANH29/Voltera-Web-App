import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await api.get("/api/v1/users/me/profile");
      setProfile(res.data);
      setForm({
        fullName: res.data.fullname || "", // backend returns 'fullname'
        email: res.data.email || "",
        phone: res.data.phone || "",
        gender:
          res.data.gender === true
            ? "male"
            : res.data.gender === false
            ? "female"
            : "",
        address: res.data.address || "",
      });
    } catch (err) {
      // Error handled silently
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function onSave() {
    setSaving(true);
    try {
      // Convert frontend form to backend format
      const [firstname, ...lastnameParts] = form.fullName.trim().split(" ");
      const lastname = lastnameParts.join(" ") || "";

      const profileData = {
        firstname: firstname || "",
        lastname: lastname,
        email: form.email,
        phone: form.phone,
        gender:
          form.gender === "male"
            ? true
            : form.gender === "female"
            ? false
            : null,
        address: form.address,
      };

      const res = await api.put("/api/v1/users/me/profile", profileData);
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/api/upload/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reload profile to get updated avatar
      await loadProfile();

      // Update localStorage if exists
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        userData.avatar = res.data;
        localStorage.setItem("currentUser", JSON.stringify(userData));
      }

      alert("Avatar updated successfully!");
    } catch (err) {
      alert("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  }

  if (!profile) return <div className="profile-root">Loading profile...</div>;

  return (
    <div className="profile-root">
      <div className="profile-card">
        <h2>Your Profile</h2>

        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-container">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="profile-avatar"
              />
            ) : (
              <div className="avatar-placeholder-large">
                {(profile?.fullname?.charAt(0) || "U").toUpperCase()}
              </div>
            )}
            <div className="avatar-upload">
              <input
                type="file"
                id="avatar-input"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
              <label
                htmlFor="avatar-input"
                className={`avatar-upload-btn ${
                  uploadingAvatar ? "uploading" : ""
                }`}
              >
                {uploadingAvatar ? "Uploading..." : "Change Avatar"}
              </label>
            </div>
          </div>
        </div>

        {!editing ? (
          <div className="profile-view">
            <p>
              <strong>Full Name:</strong> {profile.fullname}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {profile.phone}
            </p>
            <p>
              <strong>Gender:</strong>{" "}
              {profile.gender
                ? "Male"
                : profile.gender === false
                ? "Female"
                : "Not specified"}
            </p>
            <p>
              <strong>Address:</strong> {profile.address}
            </p>
            <div className="profile-actions">
              <button onClick={() => setEditing(true)} className="btn">
                Edit
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-edit">
            <label>
              Full Name
              <input
                name="fullName"
                value={form.fullName || ""}
                onChange={onChange}
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email || ""}
                onChange={onChange}
              />
            </label>
            <label>
              Phone Number
              <input
                name="phone"
                value={form.phone || ""}
                onChange={onChange}
              />
            </label>
            <label>
              Gender
              <select
                name="gender"
                value={form.gender || ""}
                onChange={onChange}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label>
              Address
              <textarea
                name="address"
                value={form.address || ""}
                onChange={onChange}
              />
            </label>
            <div className="profile-actions">
              <button onClick={onSave} className="btn" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
