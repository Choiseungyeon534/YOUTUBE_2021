import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Avatar } from 'antd';
import moment from 'moment';
import Axios from 'axios';

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
  const [Video, setVideo] = useState([]);

  useEffect(() => {
    const subscriptionVariables = {
      userFrom: localStorage.getItem('userId'),
    };
    Axios.post('/api/video/getSubscriptionVideos', subscriptionVariables)
    .then(response => {
        if (response.data.success) {
          console.log(response.data);
          setVideo(response.data.videos);
        } else {
          alert('구독자 비디오 가져오기를 실패했습니다.');
        }
      }
    );
  }, []);

  const renderCards = Video.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24} key={index}>
        {/*lg:가장클때 6그리드를쓰겠다. md:중간크기일때 8그리드를 쓰겠다. xs:가장작은 크기일때는 24그리드를 쓰겠다. 총24그리드 */}
        <div style={{ position: 'relative' }}>
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: '100%' }}
              alt="thumbnail"
              src={`http://localhost:5000/${video.thumbnail}`}
            />
            <div
              className="duration"
              style={{
                bottom: 0,
                right: 0,
                position: 'absolute',
                margin: '4px',
                color: '#fff',
                backgroundColor: 'rgba(17, 17, 17, 0.8)',
                opacity: 0.8,
                padding: '2px 4px',
                borderRadius: '2px',
                letterSpacing: '0.5px',
                fontSize: '12px',
                fontWeight: '500',
                lineHeight: '12px',
              }}
            >
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
        </div>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
        />
        <span>{video.writer.name} </span>
        <br />
        <span style={{ marginLeft: '3rem' }}> {video.views}</span>-
        <span> {moment(video.createdAt).format('MMM Do YY')} </span>
      </Col>
    );
  });
  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Title level={2}>Recommended</Title>
      <hr />
      <Row gutter={16}>{renderCards}</Row>
    </div>
  );
}

export default SubscriptionPage;