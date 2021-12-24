import uploadcare from 'uploadcare-widget'

const widget = uploadcare.Widget("#uploader", { publicKey: 'b04c4bcbd68df83a407f' });
widget.onUploadComplete(fileInfo => {
    // get a CDN URL from the file info
    console.log(`my upload object output ${fileInfo.cdnUrl}`);
    console.log(fileInfo);
  });
