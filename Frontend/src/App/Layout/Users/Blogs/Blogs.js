import React, { useState, useEffect } from "react";
import BlogCard from "./BlogsCard"; // Import BlogCard Component
import { GetBlogData } from "../../../Services/UserService/User";
import Content from '../../../components/Contents/Content';
import Loader from "../../../../Utils/Loader";

const Blogs = () => {
  const [blogData, setBlogData] = useState([]);
  const [isLoading, setIsLoading] = useState(true)


  const GetBlogDataApi = async () => {
    try {
      const response = await GetBlogData();
      if (response.status) {
        setBlogData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
  };

  useEffect(() => {
    GetBlogDataApi();
  }, []);

  return (
    <Content
      Page_title="Blogs"
      button_status={false}
      backbutton_status={true}
    >
    
      <div className="row">
        {blogData.length > 0 ? (
          blogData.map((blog, index) => <BlogCard key={index} blog={blog} />)
        ) : (
          <div className="dark text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 240 160"
            width="240"
            height="160"
          >
            <defs>
              {/* Gradients for light and dark modes */}
              <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f0f0f0" />
                <stop offset="100%" stopColor="#dcdcdc" />
              </linearGradient>
              <linearGradient id="bgGradientDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#333333" />
                <stop offset="100%" stopColor="#1a1a1a" />
              </linearGradient>
        
              {/* Drop shadow filter for subtle 3D effect */}
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
              </filter>
            </defs>
        
            <g id="laptop" filter="url(#shadow)">
              {/* Laptop outer body */}
              <rect x="20" y="20" width="200" height="100" rx="10" ry="10" fill="#cccccc" />
        
              {/* Laptop screen */}
              <rect
                x="30"
                y="30"
                width="180"
                height="80"
                rx="5"
                ry="5"
                className="screen-bg"
              />
        
              {/* Loader dots */}
              <g id="loader-dots">
                <circle cx="110" cy="65" r="3" className="dot" style={{ animationDelay: '0s' }} />
                <circle cx="120" cy="65" r="3" className="dot" style={{ animationDelay: '0.2s' }} />
                <circle cx="130" cy="65" r="3" className="dot" style={{ animationDelay: '0.4s' }} />
              </g>
        
              {/* "No Data Found" text inside the screen */}
              <text
                x="120"
                y="85"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                style={{ fontSize: '14px', fontFamily: 'Arial, sans-serif' }}
              >
                No Data Found
              </text>
        
              {/* Laptop base/keyboard */}
              <rect x="30" y="120" width="180" height="10" rx="3" ry="3" fill="#888888" />
            </g>
          </svg>
        </div>
        )}
      </div>
    </Content>
  );
};



export default Blogs;
