import React, { useEffect, useState } from "react";
import "./Admin.css";

function Admin({ onLogout }) {
  const [contacts, setContacts] = useState([]);
  const [plants, setPlants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [plantsLoading, setPlantsLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] = useState("dashboard");

  const [showPlantForm, setShowPlantForm] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);

  const [plantForm, setPlantForm] = useState({
    name: "",
    category: "Indoor Plant",
    description: "",
    image: "",
    sunlight: "",
    watering: "",
    benefits: ""
  });

  /* =========================
     LOAD CONTACTS
  ========================= */

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://project-plants-1.onrender.com/api/contacts"
      );

      if (!response.ok) {
        throw new Error("Failed to load contacts");
      }

      const data = await response.json();

      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Contact Error:", error);
      setError("Unable to load messages.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOAD PLANTS
  ========================= */

  const loadPlants = async () => {
    try {
      setPlantsLoading(true);

      const response = await fetch(
        "https://project-plants-1.onrender.com/api/plants"
      );

      if (!response.ok) {
        throw new Error("Failed to load plants");
      }

      const data = await response.json();

      setPlants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Plant Error:", error);
    } finally {
      setPlantsLoading(false);
    }
  };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    loadContacts();
    loadPlants();
  }, []);

  /* =========================
     PLANT FORM CHANGE
  ========================= */

  const handlePlantChange = (e) => {
    const { name, value } = e.target;

    setPlantForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  /* =========================
     RESET FORM
  ========================= */

  const resetPlantForm = () => {
    setPlantForm({
      name: "",
      category: "Indoor Plant",
      description: "",
      image: "",
      sunlight: "",
      watering: "",
      benefits: ""
    });

    setEditingPlant(null);
    setShowPlantForm(false);
  };

  /* =========================
     ADD / UPDATE PLANT
  ========================= */

  const handlePlantSubmit = async (e) => {
    e.preventDefault();

    if (
      !plantForm.name.trim() ||
      !plantForm.category.trim() ||
      !plantForm.description.trim()
    ) {
      alert("Please fill the required fields.");
      return;
    }

    try {
      const url = editingPlant
        ? `https://project-plants-1.onrender.com/api/plants/${editingPlant.id}`
        : "https://project-plants-1.onrender.com/api/plants";

      const method = editingPlant ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(plantForm)
      });

      if (!response.ok) {
        throw new Error("Plant save failed");
      }

      await response.json();

      alert(
        editingPlant
          ? "Plant updated successfully! 🌱"
          : "Plant added successfully! 🌱"
      );

      resetPlantForm();
      await loadPlants();
    } catch (error) {
      console.error("Save Plant Error:", error);
      alert("Unable to save plant. Please try again.");
    }
  };

  /* =========================
     EDIT PLANT
  ========================= */

  const handleEditPlant = (plant) => {
    setEditingPlant(plant);

    setPlantForm({
      name: plant.name || "",
      category: plant.category || "Indoor Plant",
      description: plant.description || "",
      image: plant.image || "",
      sunlight: plant.sunlight || "",
      watering: plant.watering || "",
      benefits: plant.benefits || ""
    });

    setShowPlantForm(true);
    setActiveSection("plants");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  /* =========================
     DELETE PLANT
  ========================= */

  const handleDeletePlant = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this plant?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `https://project-plants-1.onrender.com/api/plants/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setPlants((previous) =>
        previous.filter((plant) => plant.id !== id)
      );

      alert("Plant deleted successfully.");
    } catch (error) {
      console.error("Delete Plant Error:", error);
      alert("Unable to delete plant.");
    }
  };

  /* =========================
     SIDEBAR SECTION
  ========================= */

  const showSection = (section) => {
    setActiveSection(section);

    if (section === "messages") {
      loadContacts();
    }

    if (section === "plants") {
      loadPlants();
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="admin-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="admin-sidebar">

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            🌱
          </div>

          <div className="sidebar-brand-text">
            <h2>Plant World</h2>
            <span>Admin Panel</span>
          </div>

        </div>

        <nav className="sidebar-menu">

          <button
            type="button"
            className={`sidebar-item ${
              activeSection === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() => showSection("dashboard")}
          >
            <span className="sidebar-icon">📊</span>
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`sidebar-item ${
              activeSection === "messages"
                ? "active"
                : ""
            }`}
            onClick={() => showSection("messages")}
          >
            <span className="sidebar-icon">📩</span>
            <span>Messages</span>
          </button>

          <button
            type="button"
            className={`sidebar-item ${
              activeSection === "plants"
                ? "active"
                : ""
            }`}
            onClick={() => showSection("plants")}
          >
            <span className="sidebar-icon">🌿</span>
            <span>Plants</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <a href="/">
            <span>←</span>
            <span>View Website</span>
          </a>

          <button
            type="button"
            onClick={onLogout}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="admin-main">

        {/* ================= TOPBAR ================= */}

        <header className="admin-topbar">

          <div className="topbar-heading">

            <p>PLANT WORLD</p>

            <h1>
              {activeSection === "plants"
                ? "Plant Management"
                : activeSection === "messages"
                ? "Contact Messages"
                : "Admin Dashboard"}
            </h1>

          </div>

          <div className="admin-user">

            <div className="admin-user-avatar">
              A
            </div>

            <div className="admin-user-info">
              <strong>Administrator</strong>
              <span>● Online</span>
            </div>

          </div>

        </header>

        {/* ================= DASHBOARD ================= */}

        {activeSection === "dashboard" && (
          <>

            <section className="admin-stat-grid">

              <div className="dashboard-stat">

                <div className="stat-icon green">
                  🌿
                </div>

                <div className="stat-content">
                  <span>Plant Collection</span>

                  <strong>
                    {plants.length}
                  </strong>

                  <small>
                    Available in database
                  </small>
                </div>

              </div>

              <div className="dashboard-stat">

                <div className="stat-icon blue">
                  📩
                </div>

                <div className="stat-content">
                  <span>Total Messages</span>

                  <strong>
                    {contacts.length}
                  </strong>

                  <small>
                    Contact submissions
                  </small>
                </div>

              </div>

              <div className="dashboard-stat">

                <div className="stat-icon orange">
                  🔔
                </div>

                <div className="stat-content">
                  <span>System Status</span>

                  <strong>
                    Active
                  </strong>

                  <small>
                    Dashboard is running
                  </small>
                </div>

              </div>

            </section>

            <section className="admin-content-card">

              <div className="dashboard-welcome">

                <div className="welcome-icon">
                  🌱
                </div>

                <div className="welcome-text">
                  <h2>
                    Welcome to Plant World Admin
                  </h2>

                  <p>
                    Manage your plant collection and
                    website contact messages from one place.
                  </p>
                </div>

              </div>

              <div className="quick-actions">

                <button
                  type="button"
                  onClick={() =>
                    showSection("plants")
                  }
                >
                  🌿 Manage Plants
                </button>

                <button
                  type="button"
                  onClick={() =>
                    showSection("messages")
                  }
                >
                  📩 View Messages
                </button>

              </div>

            </section>

          </>
        )}

        {/* ================= MESSAGES ================= */}

        {activeSection === "messages" && (

          <section className="admin-content-card">

            <div className="content-card-header">

              <div>
                <h2>
                  Contact Messages
                </h2>

                <p>
                  Messages received from website visitors.
                </p>
              </div>

              <button
                type="button"
                className="refresh-button"
                onClick={loadContacts}
              >
                🔄 Refresh
              </button>

            </div>

            {loading && (
              <div className="admin-status">
                <div>🌱</div>

                <h3>
                  Loading messages...
                </h3>

                <p>
                  Please wait.
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="admin-status">

                <div>⚠️</div>

                <h3>
                  {error}
                </h3>

                <button
                  type="button"
                  onClick={loadContacts}
                >
                  Try Again
                </button>

              </div>
            )}

            {!loading &&
              !error &&
              contacts.length === 0 && (

                <div className="admin-status">

                  <div>📭</div>

                  <h3>
                    No Messages Yet
                  </h3>

                  <p>
                    Contact form messages will appear here.
                  </p>

                </div>
              )}

            {!loading &&
              !error &&
              contacts.length > 0 && (

                <div className="message-list">

                  {contacts.map((contact) => (

                    <article
                      className="message-card"
                      key={contact.id}
                    >

                      <div className="message-header">

                        <div className="message-user">

                          <div className="message-avatar">
                            {contact.name
                              ? contact.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "U"}
                          </div>

                          <div className="message-user-info">

                            <h3>
                              {contact.name}
                            </h3>

                            <p>
                              {contact.email}
                            </p>

                          </div>

                        </div>

                        <span className="message-badge">
                          NEW
                        </span>

                      </div>

                      <div className="message-content">

                        <span>
                          MESSAGE
                        </span>

                        <p>
                          {contact.message}
                        </p>

                      </div>

                      <div className="message-footer">
                        Message ID: #{contact.id}
                      </div>

                    </article>

                  ))}

                </div>
              )}

          </section>
        )}

        {/* ================= PLANTS ================= */}

        {activeSection === "plants" && (

          <section className="admin-content-card">

            <div className="content-card-header">

              <div>
                <h2>
                  Plant Collection
                </h2>

                <p>
                  Add, edit and manage plants in the database.
                </p>
              </div>

              <div className="plant-header-actions">

                <button
                  type="button"
                  className="refresh-button"
                  onClick={loadPlants}
                >
                  🔄 Refresh
                </button>

                <button
                  type="button"
                  className="add-plant-button"
                  onClick={() => {

                    if (showPlantForm) {
                      resetPlantForm();
                    } else {
                      setEditingPlant(null);
                      setShowPlantForm(true);
                    }

                  }}
                >
                  {showPlantForm
                    ? "✕ Close"
                    : "＋ Add Plant"}
                </button>

              </div>

            </div>

            {/* ================= FORM ================= */}

            {showPlantForm && (

              <form
                className="plant-form"
                onSubmit={handlePlantSubmit}
              >

                <div className="form-title">

                  <h3>
                    {editingPlant
                      ? "✏️ Edit Plant"
                      : "🌱 Add New Plant"}
                  </h3>

                  <p>
                    Fill in the plant information below.
                  </p>

                </div>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Plant Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Example: Money Plant"
                      value={plantForm.name}
                      onChange={handlePlantChange}
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Category *
                    </label>

                    <select
                      name="category"
                      value={plantForm.category}
                      onChange={handlePlantChange}
                    >

                      <option value="Indoor Plant">
                        Indoor Plant
                      </option>

                      <option value="Medicinal">
                        Medicinal
                      </option>

                      <option value="Outdoor Plant">
                        Outdoor Plant
                      </option>

                      <option value="Desert">
                        Desert
                      </option>

                    </select>

                  </div>

                  <div className="form-group full">

                    <label>
                      Description *
                    </label>

                    <textarea
                      name="description"
                      rows="4"
                      placeholder="Enter plant description..."
                      value={plantForm.description}
                      onChange={handlePlantChange}
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Image Path
                    </label>

                    <input
                      type="text"
                      name="image"
                      placeholder="/images/plant.jpg"
                      value={plantForm.image}
                      onChange={handlePlantChange}
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Sunlight
                    </label>

                    <input
                      type="text"
                      name="sunlight"
                      placeholder="Indirect sunlight"
                      value={plantForm.sunlight}
                      onChange={handlePlantChange}
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Watering
                    </label>

                    <input
                      type="text"
                      name="watering"
                      placeholder="Water when soil is dry"
                      value={plantForm.watering}
                      onChange={handlePlantChange}
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Benefits
                    </label>

                    <input
                      type="text"
                      name="benefits"
                      placeholder="Enter plant benefits"
                      value={plantForm.benefits}
                      onChange={handlePlantChange}
                    />

                  </div>

                </div>

                <div className="form-actions">

                  <button
                    type="submit"
                    className="save-plant-button"
                  >
                    {editingPlant
                      ? "✓ Update Plant"
                      : "＋ Save Plant"}
                  </button>

                  <button
                    type="button"
                    className="cancel-plant-button"
                    onClick={resetPlantForm}
                  >
                    Cancel
                  </button>

                </div>

              </form>
            )}

            {/* ================= PLANT LIST ================= */}

            {plantsLoading ? (

              <div className="admin-status">

                <div>🌱</div>

                <h3>
                  Loading plants...
                </h3>

                <p>
                  Please wait.
                </p>

              </div>

            ) : plants.length === 0 ? (

              <div className="admin-status">

                <div>🌿</div>

                <h3>
                  No Plants Found
                </h3>

                <p>
                  Add your first plant using the button above.
                </p>

              </div>

            ) : (

              <div className="admin-plant-list">

                {plants.map((plant) => (

                  <article
                    className="admin-plant-card"
                    key={plant.id}
                  >

                    <div className="admin-plant-image">

                      {plant.image ? (

                        <img
                          src={plant.image}
                          alt={plant.name}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement.classList.add(
                              "image-failed"
                            );
                          }}
                        />

                      ) : (

                        <div className="image-placeholder">
                          🌱
                        </div>

                      )}

                    </div>

                    <div className="admin-plant-info">

                      <div className="admin-plant-top">

                        <span className="admin-plant-category">
                          {plant.category}
                        </span>

                        <span className="admin-plant-id">
                          #{plant.id}
                        </span>

                      </div>

                      <h3>
                        {plant.name}
                      </h3>

                      <p className="plant-description">
                        {plant.description}
                      </p>

                      <div className="admin-plant-details">

                        <span>
                          ☀️
                          <strong>Sunlight:</strong>{" "}
                          {plant.sunlight || "Not specified"}
                        </span>

                        <span>
                          💧
                          <strong>Watering:</strong>{" "}
                          {plant.watering || "Not specified"}
                        </span>

                      </div>

                      <div className="plant-actions">

                        <button
                          type="button"
                          className="edit-plant-button"
                          onClick={() =>
                            handleEditPlant(plant)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          className="delete-plant-button"
                          onClick={() =>
                            handleDeletePlant(plant.id)
                          }
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default Admin;