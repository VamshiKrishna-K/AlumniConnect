import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function StudentProfile() {
  const uid = auth.currentUser?.uid;

  const [profile, setProfile] = useState({
    branch: "",
    year: "",
    skills: "",
    profileImage: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // 🔹 Load existing profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!uid) return;

      const snap = await getDoc(doc(db, "student_profiles", uid));
      if (snap.exists()) {
        setProfile(snap.data());
      }
      setLoading(false);
    };

    loadProfile();
  }, [uid]);

  // 🔹 Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    const url = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`;

    const res = await fetch(url, {
      method: "POST",
      body: data,
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Cloudinary error:", result);
      throw new Error("Image upload failed");
    }

    return result.secure_url;
  };

  // 🔹 Save profile
  const saveProfile = async (e) => {
    e.preventDefault();
    setMessage("Saving...");

    try {
      let imageUrl = profile.profileImage;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      await setDoc(doc(db, "student_profiles", uid), {
        userId: uid,
        branch: profile.branch,
        year: Number(profile.year),
        skills: profile.skills,
        profileImage: imageUrl,
      });

      setMessage("Profile updated successfully ✅");
    } catch (err) {
      console.error("Save error:", err);
      setMessage("Profile update failed ❌");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading profile...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">

              {/* ===== PROFILE IMAGE HEADER ===== */}
              <div className="text-center mb-4">
                <img
                  src={
                    profile.profileImage ||
                    "https://via.placeholder.com/180?text=Profile"
                  }
                  alt="Profile"
                  className="rounded-circle shadow"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                    border: "4px solid #0d6efd",
                  }}
                />

                <div className="mt-3">
                  <label className="btn btn-outline-primary btn-sm">
                    Change Profile Photo
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>

              <h4 className="fw-bold text-center mb-3">
                Student Profile
              </h4>

              {message && (
                <div className="alert alert-info text-center">
                  {message}
                </div>
              )}

              <form onSubmit={saveProfile}>
                <div className="mb-3">
                  <label className="form-label">Branch</label>
                  <input
                    className="form-control"
                    value={profile.branch}
                    onChange={(e) =>
                      setProfile({ ...profile, branch: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Academic Year</label>
                  <input
                    type="number"
                    className="form-control"
                    value={profile.year}
                    onChange={(e) =>
                      setProfile({ ...profile, year: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Skills</label>
                  <input
                    className="form-control"
                    value={profile.skills}
                    onChange={(e) =>
                      setProfile({ ...profile, skills: e.target.value })
                    }
                  />
                </div>

                <button className="btn btn-primary w-100">
                  Save Profile
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
