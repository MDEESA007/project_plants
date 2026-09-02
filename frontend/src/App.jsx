import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [contact, setContact] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [contactMessage, setContactMessage] = useState("");

  /* =========================================================
     LOAD PLANTS
  ========================================================= */

  useEffect(() => {
    fetch("https://project-plants-1.onrender.com/api/plants")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load plants");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Plants:", data);
        setPlants(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Plant Error:", error);
        setLoading(false);
      });
  }, []);

  /* =========================================================
     SAVE FAVORITES
  ========================================================= */

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  /* =========================================================
     FILTER PLANTS
  ========================================================= */

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = plant.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      plant.category?.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  /* =========================================================
     FAVORITE
  ========================================================= */

  const toggleFavorite = (name) => {
    if (favorites.includes(name)) {
      setFavorites(
        favorites.filter((item) => item !== name)
      );
    } else {
      setFavorites([...favorites, name]);
    }
  };

  /* =========================================================
     CONTACT INPUT
  ========================================================= */

  const handleContactChange = (e) => {
    const { name, value } = e.target;

    setContact({
      ...contact,
      [name]: value,
    });

    setContactMessage("");
  };

  /* =========================================================
     CONTACT SUBMIT
  ========================================================= */

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (
      !contact.name.trim() ||
      !contact.email.trim() ||
      !contact.message.trim()
    ) {
      setContactMessage("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contact),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      await response.json();

      setContactMessage(
        "Message sent successfully! 🌱"
      );

      setContact({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact Error:", error);

      setContactMessage(
        "Failed to send message. Please try again."
      );
    }
  };

  /* =========================================================
     IMAGE FALLBACK
  ========================================================= */

  const handleImageError = (e) => {
    e.currentTarget.style.display = "none";
    e.currentTarget.parentElement.classList.add(
      "image-missing"
    );
  };

  return (
    <div className="app">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="navbar">

        <div className="logo">
          <span>🌱</span>
          Plant World
        </div>

        <div className="nav-links">

          <a href="#home">Home</a>

          <a href="#plants">Plants</a>

          <a href="#about">About</a>

          <a href="#contact">Contact</a>

          <a
            href="/admin"
            className="admin-link"
          >
            Admin
          </a>

          <span className="favorite-count">
            ❤️ {favorites.length}
          </span>

        </div>

      </nav>

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section
        id="home"
        className="hero"
      >

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <p className="hero-small">
            WELCOME TO PLANT WORLD
          </p>

          <h1>
            Discover the Beauty
            <br />
            of <span>Nature</span>
          </h1>

          <p className="hero-description">
            Explore different plants, learn about
            their benefits, understand their care
            requirements, and bring more greenery
            into your life.
          </p>

          <a
            href="#plants"
            className="hero-button"
          >
            Explore Plants 🌿
          </a>

        </div>

      </section>

      {/* =====================================================
          PLANTS SECTION
      ===================================================== */}

      <section
        id="plants"
        className="plants-section"
      >

        <div className="section-heading">

          <p>OUR COLLECTION</p>

          <h2>
            Explore Our Plants
          </h2>

          <span>
            Discover plants for every space
            and every lifestyle.
          </span>

        </div>

        {/* SEARCH + CATEGORY */}

        <div className="filter-area">

          <div className="search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search plants..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="category-box">

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="All">
                All Plants
              </option>

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

        </div>

        {/* PLANT CARDS */}

        {loading ? (

          <div className="no-results">

            <div>🌱</div>

            <h3>
              Loading Plants...
            </h3>

            <p>
              Please wait while plants are loading.
            </p>

          </div>

        ) : (

          <div className="plant-container">

            {filteredPlants.length > 0 ? (

              filteredPlants.map((plant) => (

                <div
                  className="plant-card"
                  key={plant.id}
                >

                  <div className="image-wrapper">

                    <img
                      className="plant-image"
                      src={plant.image}
                      alt={plant.name}
                      onError={handleImageError}
                    />

                    <div className="image-fallback">
                      🌱
                      <span>{plant.name}</span>
                    </div>

                    <button
                      className="favorite-button"
                      type="button"
                      aria-label={`Favorite ${plant.name}`}
                      onClick={() =>
                        toggleFavorite(plant.name)
                      }
                    >
                      {favorites.includes(
                        plant.name
                      )
                        ? "❤️"
                        : "🤍"}
                    </button>

                    <span className="plant-category">
                      {plant.category}
                    </span>

                  </div>

                  <div className="plant-card-content">

                    <h3>
                      {plant.name}
                    </h3>

                    <p>
                      {plant.description}
                    </p>

                    <button
                      className="details-button"
                      type="button"
                      onClick={() =>
                        setSelectedPlant(plant)
                      }
                    >
                      View Details →
                    </button>

                  </div>

                </div>

              ))

            ) : (

              <div className="no-results">

                <div>🌱</div>

                <h3>
                  No Plants Found
                </h3>

                <p>
                  Try searching for another plant
                  or choose a different category.
                </p>

              </div>

            )}

          </div>

        )}

      </section>

      {/* =====================================================
          PLANT DETAILS MODAL
      ===================================================== */}

      {selectedPlant && (

        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPlant(null);
            }
          }}
        >

          <div className="plant-details">

            <button
              className="close-button"
              type="button"
              aria-label="Close"
              onClick={() =>
                setSelectedPlant(null)
              }
            >
              ✕
            </button>

            <div className="modal-image-wrapper">

              <img
                src={selectedPlant.image}
                alt={selectedPlant.name}
                onError={handleImageError}
              />

              <div className="modal-image-fallback">
                🌱
                <span>{selectedPlant.name}</span>
              </div>

            </div>

            <div className="details-content">

              <span className="details-category">
                {selectedPlant.category}
              </span>

              <h2>
                {selectedPlant.name}
              </h2>

              <p className="details-description">
                {selectedPlant.description}
              </p>

              <div className="info-grid">

                <div>
                  <span>💚</span>

                  <h4>
                    Benefits
                  </h4>

                  <p>
                    {selectedPlant.benefits ||
                      "Benefits information is not available."}
                  </p>
                </div>

                <div>
                  <span>💧</span>

                  <h4>
                    Watering
                  </h4>

                  <p>
                    {selectedPlant.watering ||
                      "Water according to the plant's requirements."}
                  </p>
                </div>

                <div>
                  <span>☀️</span>

                  <h4>
                    Sunlight
                  </h4>

                  <p>
                    {selectedPlant.sunlight ||
                      "Provide suitable sunlight."}
                  </p>
                </div>

                <div>
                  <span>🌱</span>

                  <h4>
                    Care
                  </h4>

                  <p>
                    {selectedPlant.care ||
                      "Follow the recommended watering and sunlight requirements."}
                  </p>
                </div>

              </div>

              <button
                className="close-details"
                type="button"
                onClick={() =>
                  setSelectedPlant(null)
                }
              >
                Close Details
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          ABOUT / COMPANY
      ===================================================== */}

      <section
        id="about"
        className="about-section"
      >

        <div className="about-heading">

          <p className="section-label">
            ABOUT PLANT WORLD
          </p>

          <h2>
            Bringing Nature
            <br />
            Closer to You 🌿
          </h2>

          <p>
            Plant World is a simple platform
            designed to help people discover
            different types of plants and
            understand how to take care of them.
          </p>

        </div>

        {/* COMPANY CARD */}

        <div className="company-card">

          <div className="company-photo">

            <img
              src="/images/jagir.jpeg"
              alt="Saragen Biotech"
            />

          </div>

          <div className="company-details">

            <p className="company-label">
              OUR COMPANY
            </p>

            <h2>
              SARAGEN BIOTECH
            </h2>

            <p className="company-description">
              Saragen Biotech is focused on
              biotechnology, plant science and
              advanced research with an emphasis
              on quality and sustainable solutions.
            </p>

            <div className="company-info">

              <div>

                <span>👤</span>

                <div>
                  <small>
                    Managing Director
                  </small>

                  <strong>
                    Jagir Hussain
                  </strong>
                </div>

              </div>

              <div>

                <span>🎓</span>

                <div>
                  <small>
                    Qualification
                  </small>

                  <strong>
                    MSc Biotech
                  </strong>
                </div>

              </div>

              <div>

                <span>📧</span>

                <div>
                  <small>
                    Email
                  </small>

                  <strong>
                    jagir0236@gmail.com
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* FEATURES */}

        <div className="about-features">

          <div>
            <strong>🌱</strong>

            <h3>
              Plant Knowledge
            </h3>

            <p>
              Learn about different plants.
            </p>
          </div>

          <div>
            <strong>💧</strong>

            <h3>
              Care Guidance
            </h3>

            <p>
              Understand proper plant care.
            </p>
          </div>

          <div>
            <strong>🌍</strong>

            <h3>
              Go Green
            </h3>

            <p>
              Make your environment greener.
            </p>
          </div>

        </div>

      </section>

      {/* =====================================================
          CONTACT SECTION
      ===================================================== */}

      <section
        id="contact"
        className="contact-section"
      >

        <div className="section-heading">

          <p>
            GET IN TOUCH
          </p>

          <h2>
            Contact Us
          </h2>

          <span>
            Have a question?
            We would love to hear from you.
          </span>

        </div>

        <div className="contact-container">

          {/* CONTACT INFORMATION */}

          <div className="contact-info">

            <div>

              <span>📧</span>

              <div>
                <h3>
                  Email
                </h3>

                <p>
                  jagir0236@gmail.com
                </p>
              </div>

            </div>

            <div>

              <span>📞</span>

              <div>
                <h3>
                  Phone
                </h3>

                <p>
                  +91 97917 86317
                </p>
              </div>

            </div>

            <div>

              <span>📍</span>

              <div>
                <h3>
                  Location
                </h3>

                <p>
                  Tamil Nadu, India
                </p>
              </div>

            </div>

          </div>

          {/* CONTACT FORM */}

          <form
            className="contact-form"
            onSubmit={handleContactSubmit}
          >

            <div className="form-group">

              <label htmlFor="name">
                Your Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={contact.name}
                onChange={handleContactChange}
              />

            </div>

            <div className="form-group">

              <label htmlFor="email">
                Your Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={contact.email}
                onChange={handleContactChange}
              />

            </div>

            <div className="form-group">

              <label htmlFor="message">
                Your Message
              </label>

              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Write your message..."
                value={contact.message}
                onChange={handleContactChange}
              ></textarea>

            </div>

            <button type="submit">
              Send Message
            </button>

            {contactMessage && (
              <p className="contact-message">
                {contactMessage}
              </p>
            )}

          </form>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="footer-brand">

          <h2>
            🌱 Plant World
          </h2>

          <p>
            Discover. Learn. Grow.
          </p>

        </div>

        <div className="footer-links">

          <a href="#home">
            Home
          </a>

          <a href="#plants">
            Plants
          </a>

          <a href="#about">
            About
          </a>

          <a href="#contact">
            Contact
          </a>

        </div>

        <p className="copyright">
          © 2026 Plant World. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;