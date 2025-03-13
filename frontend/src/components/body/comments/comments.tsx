import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import commentIcon from '../comments.png';
import bookmark from '../bookmark.png';
import like from '../like.png';
import banned from '../banned.png';
import more from '../more.png';
import './comments.css';

interface Comment {
	id: number;
	content: string;
	replies?: Comment[];
	post_id: number,
	postTitle: string,
}

interface Post {
	id: string;
	title: string;
	content: string;
	author_id: number;
	date_published: string;
	likes: number;
}

interface PostComment {
	post_id: number;
	comments: Comment[];
}

const Comments = () => {
	const { id } = useParams<{ id: string }>();
	const [newComment, setNewComment] = useState<string>('');
	const [comments, setComments] = useState<PostComment[]>([]);
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const [commentsResponse, postsResponse] = await Promise.all([
				fetch('/comments'),
				fetch('/posts'),
				]);

				if (!commentsResponse.ok || !postsResponse.ok) {
					throw new Error('Failed to fetch data');
				}

				const commentsData = await commentsResponse.json();
				const postsData = await postsResponse.json();

				setComments(commentsData);
				setPosts(postsData);
			} catch (error) {
				console.error('Error fetching data:', error);
				setError('Failed to fetch data. Please try again later.');
			} finally {
				setLoading(false);
			}
    	}

    	fetchData();
  	}, []);

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewComment(event.target.value);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
    	try {
			const response = await fetch('/comments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					post_id: Number(id),
					comments: [
						{
							commentId: '1',
							author: 'KayCode',
							content: newComment,
							timestamp: new Date().toISOString(),
							replies: []
						}
					]
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to submit comment');
			}

		// Refetch comments to update the UI
			const commentsResponse = await fetch('/comments');
			if (commentsResponse.ok) {
				const data = await commentsResponse.json();
				setComments(data);
			}

			setNewComment('');
		//   alert('Comment submitted successfully!');
    	} catch (error) {
    	console.error('Error submitting comment:', error);
    //   alert('Failed to submit comment. Please try again.');
    	}
	};

	const renderCommentBox = () => (
		<form onSubmit={handleSubmit}>
			<textarea
				className="create__comment"
				name="commentArea"
				value={newComment}
				onChange={handleChange}
				placeholder="Write a comment..."
				aria-label="Write a comment"
			/>
			<button type="submit">Comment</button>
		</form>
	);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
    	return <div>Error: {error}</div>;
	}

	return (
		<div className="post">
		{posts
			.filter((post) => Number(id) === Number(post.id))
			.map((post) => (
			<div className="posts" key={post.id}>
				<h3>{post.title}</h3>
				<p>{post.content}</p>
				<div className="com__section">
				<div className="comment_like">
					<time style={{ fontSize: '1.1rem' }} dateTime={post.date_published}>
					{new Date(post.date_published).toLocaleDateString()}
					</time>
					<span style={{ fontSize: '1.1rem', margin: '.8rem' }}>
					<img className="icon" src={like} alt="like icon" aria-label="Like" />
					{post.likes}
					</span>
					<span style={{ fontSize: '1.1rem', margin: '.8rem' }}>
					<img className="icon" src={commentIcon} alt="comments" aria-label="Comments" />
					</span>
				</div>
				<div className="save__more">
					<img className="icon" src={banned} alt="banned" aria-label="Banned" />
					<img className="icon" src={bookmark} alt="save" aria-label="Save" />
					<img className="icon" src={more} alt="more" aria-label="More" />
				</div>
				</div>
			</div>
			))}
			<div style={{marginInline: "2rem"}}>{renderCommentBox()}</div>

		<section className="sec">
			{comments
			.filter((comment) => Number(id) === comment.post_id)
			.map((postComment) => (
				<div key={postComment.post_id}>
				{postComment.comments.map((comment) => (
					<RenderComment key={comment.id} {...comment} />
				))}
				</div>
			))}
		</section>
		</div>
	);
};

const RenderComment = (comment: Comment) => {
  	const [isReplyClicked, setIsReplyClicked] = useState(false);
  	const [replyContent, setReplyContent] = useState('');
	// const [newComment, setNewComment] = useState("");
	const handleReplyClick = () => {
		setIsReplyClicked(true);
	};

	const handleReplySubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const responseReplied = await fetch("/comments", {
				method: "POST",
				"content-type": "application/json",
				body: JSON.stringify({
					commentId: comment.id,
					ko: 33,
					replies: []
				})
			});
			
			if (responseReplied.ok){
				console.log('Reply submitted:', replyContent);
				setIsReplyClicked(false);
				setReplyContent('');
			}
		}
		catch {

		}
	};

  return (
    <article className="article" key={comment.id}>
      <p className="comment">{comment.content}</p>
      <div className="comment__like" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img className="icon" src={like} alt="like" aria-label="Like" />
        <p style={{ fontSize: '15px' }} onClick={handleReplyClick}>
        	Reply
        </p>
      </div>
      {isReplyClicked && (
        <form onSubmit={handleReplySubmit}>
          <textarea
            className="create__comment"
            name="commentArea"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            aria-label="Write a reply"
          />
          <button type="button" onClick={() => setIsReplyClicked(false)}>
            Cancel
          </button>
          <button type="submit">Reply</button>
        </form>
      )}
      <hr style={{ marginBlock: '0px', width: '100%', height: '.2px' }} />
      {comment.replies && comment.replies.map(RenderComment)}
    </article>
  );
};

export default Comments;
