import fs from 'fs';
import request from 'request';
import downloadsFolder from 'downloads-folder';

const downloadFile = async function (uri: string, callback: (filePath: string) => void) {
  await request.head(uri, async (err: any, res: any) => {
    try {
      if (uri) {
        const filenameSplit = uri.split('/') || [];
        const filename = filenameSplit[filenameSplit.length - 1];
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        const filePath = `${downloadsFolder()}/${filename}`;
        await request(uri).pipe(fs.createWriteStream(filePath))
          .on('close', () => callback && callback(filePath));
      } else {
        callback('no-path');
      }
    } catch (err: any) {
      console.log('ERROR DOWNLOAD IMAGE:', err);
      downloadFile(uri, callback);
    }
  });
};

export default downloadFile;
