const pinataSDK = require('@pinata/sdk');
require('dotenv').config()
const pinata = pinataSDK(process.env.pinataAPIKey, process.env.pinataSecret);
import formidable from "formidable-serverless";

const sourcePath = '/Users/rpalakkal/Desktop/Screen Shot 2021-01-11 at 1.14.56 PM.png';

const uploadFile = async (sourcePath) => {
    const result = await pinata.pinFromFS(sourcePath)
    return result.IpfsHash
}


export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      console.log(files.file.path)
      const hash = await uploadFile(files.file.path)
      console.log(hash)
      return res.json({hash})
    });
  };
  