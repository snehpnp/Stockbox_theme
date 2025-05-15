import React from "react";

const BlogCard = ({ blog }) => {
  return (
 
     <div className="col-md-4 mb-3">
     <div className="card">
      <img src={blog.image} alt="blog" style={styles.image} />
      <div style={styles.content}>
        <h3 style={styles.title}>{blog.title}</h3>
        <p dangerouslySetInnerHTML={{ __html: blog.description }} />
        {/* <p style={styles.description}>{blog.description}</p> */}
        <small style={styles.date}>
          {new Date(blog.created_at).toLocaleDateString()}
        </small>
      </div>
    </div>
     </div>
 
    
  );
};

const styles = {
 
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  content: {
    padding: "15px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
  },
  date: {
    fontSize: "12px",
    color: "#888",
  },
};

export default BlogCard;
