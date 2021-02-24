import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
]

const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
    { value: 4, label: "Natural scenery" }
]

function VideoUploadPage(props) {
    const user = useSelector(state => state.user);
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("File & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }
    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDrop = (files) => {
     
        let formData = new FormData();
        const config = {
          header: { "content-type": "multipart/form-data" }
        };
        
        formData.append("file", files[0]);
console.log(files)
        Axios.post("/api/video/uploadfiles", formData, config)
        .then(response => {
          if (response.data.success) {
            console.log(response.data.filePath);
            setFilePath(response.data.filePath)
            let variable = {
              url: response.data.filePath,
              fileName: response.data.fileName,
            };
            
            Axios.post("/api/video/thumbnail", variable)
            .then(response => {
              if (response.data.success) {
               
                setDuration(response.data.fileDuration)
                setThumbnailPath(response.data.url)
              } else {
                alert("썸네일 에러 발생");
              }
            });
          } else {
            alert("upload failed");
          }
        });
      };

      const onSubmit = (e) => {
          e.preventDefault();

          const variables = {
              writer: user.userData._id,
              title: VideoTitle,
              description: Description,
              privacy: Private,
              filePath: FilePath,
              category: Category,
              duration: Duration,
              thumbnail: ThumbnailPath
          }

          Axios.post('/api/video/uploadVideo', variables)
          .then(response => {
              if(response.data.success) {
               
                message.success('성공적으로 업로드를 했습니다.')

               setTimeout(() => {
                props.history.push('/')
               },3000)

              } else {
                  alert(' 비디오 업로드에 실패했습니다.')
              }
          })
      }
    return (

        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem ' }}>
                <Title level={2}> Upolad Video</Title>
            </div>
            <Form onSubmit={onSubmit}>
                <div style={{ display: 'felx', justifyContent: 'space-between' }}>
                    {/* drop zone */}
                    <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{
                                widht: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                                alignItems: 'center', justifyContent: 'center'
                            }}{...getRootProps()}>

                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />

                            </div>
                        )}
                    </Dropzone>

                    {/*  Thumbnail */}
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }

                </div>

                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />
                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}

                </select>
                <br />
                <br />
                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.label}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage
