import React, { useState } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment'
import ReplyComment from '../Sections/ReplyComment'

function Comment(props) {
  const videoId = props.postId;
  const [commentValue, setcommentValue] = useState('');
  const user = useSelector((state) => state.user);

  const handleChange = (event) => {
    setcommentValue(event.currentTarget.value);
  };

  const onsubmit = (event) => {
    event.preventDefault();
    const variables = {
      content: commentValue,
      writer: user.userData._id,
      postId: videoId
    };
    Axios.post('/api/comment/saveComment', variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setcommentValue("")
        props.refreshFunction(response.data.result);
      } else {
        alert('커멘트를 저장하지 못했습니다.');
      }
    });
  };
  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />

      {/* Comment Lists */}
      {props.commentLists && props.commentLists.map((comment, index) => (
        (!comment.responseTo &&
          <React.Fragment key={index}>
            <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} key={index}/>
            <ReplyComment  refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={videoId} commentLists={props.commentLists} key={index}/>
          </React.Fragment>
        )
      ))}

      {/* Root Comment Form */}

      <form style={{ display: 'flex' }} onSubmit={onsubmit}>
        <textarea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleChange}
          value={commentValue}
          placeholder="코멘트를 작성해 주세요"
        />
        <br />
        <button style={{ width: '20%', height: '52px' }} onClick={onsubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;