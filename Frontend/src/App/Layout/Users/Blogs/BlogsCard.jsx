import React from "react";

const BlogCard = ({ blog }) => {
  return (
    <div style={styles.card}>
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
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    margin: "15px",
    width: "300px",
    transition: "0.3s",
  },
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
