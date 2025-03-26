const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');

const imageUploaderV2 = async (files) => {
  const toReturn = [];
  const token = "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0";
  console.log("process.env.DMS_TOKENprocess.env.DMS_TOKEN",token)
  console.log("filesfiles",files)

  for (const item of files) {
    if (!item.buffer || !item.originalname || !item.mimetype) {
      console.error('Invalid file structure');
      continue;
    }

    const hashed = crypto.createHash('SHA256').update(item.buffer).digest('hex');
    const formData = new FormData();
    formData.append('file', item.buffer, item.originalname); // Upload file buffer
    formData.append('tags', item.originalname.substring(0, 7)); // Use part of filename as tag

    const headers = {
      'x-digest': hashed,
      token: token,
      folderPathId: 1,
      ...formData.getHeaders(),
    };

    try {
      const uploadResponse = await axios.post(`https://jharkhandegovernance.com/dms/backend/document/upload`, formData, { headers });
      const referenceNo = uploadResponse?.data?.data?.ReferenceNo;

      if (referenceNo) {
        const fileResponse = await axios.post(`https://jharkhandegovernance.com/dms/backend/document/view-by-reference`, { referenceNo }, { headers: { token: token } });
        const fullPath = fileResponse?.data?.data?.fullPath;
        if (fullPath) {
          toReturn.push(fullPath);
        }
      }
    } catch (err) {
      console.error('Error during file upload:', err);
    }
  }

  return toReturn;
};

module.exports = { imageUploaderV2 };
