import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authors from './authors.json';
import commentIcon from './comments.png';
import bookmark from './bookmark.png';
import like from './like.png';
import banned from './banned.png';
import more from './more.png';

const FeedListing = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const [responsePosts, responseComments] = await Promise.all([fetch('/posts'), fetch('/comments')]);

        if (responseComments.ok && responsePosts.ok) {
          setPosts(await responsePosts.json());
          setComments(await responseComments.json());
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    fetchPosts();
  }, []);

  const getNumberOfComments = (idPost: number) => {
    const postComments = comments.filter((comment) => comment.post_id === idPost);
    console.log(postComments);
    return postComments.reduce((total, comment) => total + comment.comments.length, 0);
  };

  const getAuthor = (authorId: number) => {
    return authors.find((author) => author.id === authorId);
  };

  return (
    <article className="art">
      {posts.map(({ id, title, content, author_id, date_published, likes }) => {
        const author = getAuthor(author_id);
        if (!author) return null; // Handle case where the author is not found.
        const commentCount = getNumberOfComments(Number(id));

        return (
          <div className="posts" key={id}>
            <Link to="/profile">
              <div className="author">
                <img src={author.avatar} alt="avatar" />
                {author.name}
              </div>
            </Link>

            <Link to={`/${author.name}/post/${id}`} style={{ margin: '.3rem' }}>
              <h3 style={{ marginBlock: '.2rem' }}>{title}</h3>
              <div>{content}</div>
            </Link>

            <div className="com__section">
              <div className="comment_like">
                <time style={{ fontSize: '1.1rem' }} dateTime={date_published}>
                  {new Date(date_published).toLocaleDateString()}
                </time>

                <span style={{ fontSize: '1.1rem', margin: '.8rem' }}>
                  <img style={{ marginRight: '.2rem' }} className="icon" src={like} alt="like icon" />
                  {likes}
                </span>

                <Link to={`/${author.name}/post/${id}`}>
                  <span style={{ fontSize: '1.1rem', margin: '.8rem' }}>
                    <img style={{ marginRight: '.2rem' }} className="icon" src={commentIcon} alt="comments" />
                    {commentCount}
                  </span>
                </Link>
              </div>

              <div className="save__more">
                <img className="icon" src={banned} alt="banned" />
                <img className="icon" src={bookmark} alt="save" />
                <img className="icon" src={more} alt="more" />
              </div>
            </div>
          </div>
        );
      })}
    </article>
  );
};

export default FeedListing;
