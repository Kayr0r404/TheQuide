import React, { useState } from 'react';

const Article = () => {
    const [newPost, setNewPost] = useState("");
    const [articleTitle, setArticleTitle] = useState("");

    const handleSubmit = async(event) => {
        event.preventDefault();
         const response = await fetch("http://localhost:8080/posts", {
            method: "POST",
            "content-type": "application/json",
            body: JSON.stringify({
                id: 109,
                title: articleTitle,
                content: newPost,
                author_id: 5,
                date_published: "2025-03-04",
                likes: 120,
                tags: [
                    "AI",
                    "Technology",
                    "Future"
                ]
            })
         });

         if (response.ok) {
            setNewPost("");
            setArticleTitle("");
         }
    }

    const handleChange = (event) => {
        setNewPost(event.target.value);
        // setFormData((previousFormData) => ({...previousFormData, [name]: value}));
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>tittle of your article<input type='text' name="title" value={articleTitle} onChange={(e) => {setArticleTitle(e.target.value)}} /></label>
            <textarea className="create__comment" name="story" value={newPost} onChange={handleChange}></textarea>
            <button>publish</button>
        </form>
    );
}

export default Article;
