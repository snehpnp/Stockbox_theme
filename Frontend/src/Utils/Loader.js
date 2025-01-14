import React from 'react';


function Loader() {
    return (
        <div className="loader-container">
            <div className="loader">
                <div className="loader__bar" style={{ animationDelay: '0s' }}></div>
                <div className="loader__bar" style={{ animationDelay: '0.2s' }}></div>
                <div className="loader__bar" style={{ animationDelay: '0.4s' }}></div>
                <div className="loader__bar" style={{ animationDelay: '0.6s' }}></div>
                <div className="loader__bar" style={{ animationDelay: '0.8s' }}></div>
                <div className="loader__ball"></div>
            </div>
        </div>
    );
}

export default Loader;
