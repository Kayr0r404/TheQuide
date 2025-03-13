import React, { useState } from "react";

function CreateAccount() {
    const [formData, setFormData] = useState({ name: "", email: "", bio: "", avatar: "" });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch("http://localhost:8080/author", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, id: 18 }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Author created:", data);
            } else {
                console.error("Failed to create author");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio">kk</textarea>
            <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} placeholder="Avatar URL" />
            <button type="submit">Submit</button>
        </form>
    );
}

export default CreateAccount;
