import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
const FormData = require('form-data');
 
export default function MyDropzone(props) {
  const onDrop = useCallback(async (acceptedFiles) => {
    const body = new FormData()
    body.append('file', acceptedFiles[0])
    props.onUpload(body)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
 
  return (
    <div {...getRootProps()} style={{height:'10rem', backgroundColor:'#EEEEEE', display:"flex", justifyContent:"center", borderRadius:'2rem'}}>
      <input {...getInputProps()}/>
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drop a file here to get started</p>
      }
    </div>
  )
}