import React, { useState, useEffect } from "react";
import "./AppCenter.css";
import LoadingScreen from "../../Components/LoadingScreen/LoadingScreen";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';



const AppCenter = () => {
  const [apps, setApps] = useState([]);
  const [currentApp, setCurrentApp] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://obinnanwachukwu.com/projects/project_list.json', {cache: "no-cache"})
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch projects');
        return response.json();
      })
      .then(data => {
        setApps(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (apps.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % apps.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [apps]);

  const openApp = (app) => {
    setCurrentApp(app);
  };

  const goBack = () => {
    setCurrentApp(null);
  };

  return (
    <div className="app-center">
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <div className="error-message" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '2rem' }}>
          <FontAwesomeIcon icon={faFaceFrown} size="4x" />
          <h3>The App Center isn't working right now</h3>
          <p>err-code: {error}</p>
        </div>
      ) : (
        <div>
        {!currentApp ? (
          <div className="main-page">
            {/* Carousel Section */}
            <div className="carousel">
              <div
                className="carousel-item"
                style={{ backgroundImage: `url(${apps[carouselIndex].image})` }}
              >
                <div className="carousel-content">
                  <h2>{apps[carouselIndex].name}</h2>
                  <p>{apps[carouselIndex].description}</p>
                  <button
                    className="details-button"
                    onClick={() => openApp(apps[carouselIndex])}
                  >
                    See details
                  </button>
                </div>
              </div>
            </div>
  
            {/* App List Section */}
            <div>
              <h2>Projects</h2>
              <div className="app-list">
                
                {apps.map((app) => (
                  <div
                    key={app.id}
                    className="app-item"
                    onClick={() => openApp(app)}
                  >
                    <div className="app-icon">{app.icon}</div>
                    <div className="app-info">
                      <h3>{app.name}</h3>
                      <p>{app.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="app-page">
            <button className="app-center-back-button" onClick={goBack}>
              ← Back
            </button>
            <h2>{currentApp.name}</h2>
            <p>{currentApp.fullDescription}</p>
            <div className="screenshots">
              {currentApp.screenshots.map((src, index) => (
                <div key={index} className="screenshots-container">
                  <img src={src} alt={`${currentApp.name} screenshot`} />
                  <p className="screenshots-desc">{currentApp.screenshotdescriptions[index]}</p>
                </div>
              ))}
            </div>
            {currentApp.canTry ? (
              <button className="back-button" onClick={() => window.open(currentApp.trial)}>
              Try Now
            </button>
          ) : null}

          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default AppCenter;