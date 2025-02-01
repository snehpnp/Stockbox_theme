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
      <div style={styles.container}>
        {isLoading ? <Loader /> : <div style={styles.blogList}>
          {blogData.length > 0 ? (
            blogData.map((blog, index) => <BlogCard key={index} blog={blog} />)
          ) : (
            <p>No blogs available</p>
          )}
        </div>}
      </div>
    </Content>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  blogList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
};

export default Blogs;
