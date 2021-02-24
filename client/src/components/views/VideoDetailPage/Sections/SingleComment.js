import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {
    const user = useSelector((state) => state.user);
    const [OpenReply, setOpenReply] = useState(false)
    const [commentValue, setcommentValue] = useState("")
    
    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }
    const onChangeHandler = (e) => {
        setcommentValue(e.currentTarget.value)
        
    }
    
    const onSubmit = (event) => {
        event.preventDefault();
        const variables = {
          content: commentValue,
          writer: user.userData._id,
          postId: props.postId,
          responseTo: props.comment._id
        }
        Axios.post('/api/comment/saveComment', variables).then((response) => {
          if (response.data.success) {
            console.log(response.data.result);
            setcommentValue("")
            setOpenReply(false)
            props.refreshFunction(response.data.result);
          } else {
            alert('커멘트를 저장하지 못했습니다.');
          }
        });
      };
    const actions = [
        <LikeDislikes comment userId={localStorage.getItem('userId')} commentId={props.comment._id} />,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to"> Reply to </span>
    ]
    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p>{props.comment.content}</p>}
            />
            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <textarea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onChangeHandler}
                        value={commentValue}
                        placeholder="코멘트를 작성해 주세요"
                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
                        Submit
                    </button>
                </form>
            }

        </div>
    )
}

export default SingleComment
