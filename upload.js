const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const Client = require('ssh2-sftp-client');


module.exports = function upload(req, res) {
  const form = new IncomingForm({maxFileSize: 1024*1024*1024});
  
  form.on('file', (field, file) => {
    const dataStream = fs.createReadStream(file.path);
    const sftpDts = '/usr/local/WowzaStreamingEngine-4.7.7/content/' + file.name;
    // put(dataStream, sftpDts);
    fastPut(file.path, sftpDts);
  });
  form.on('end', () => {
    res.json();
  });
  form.parse(req);
};

function put(dataStream, remote) {
  const sftp = new Client();
  sftp.connect({
    host: 'stream.hcmue.space',
      port: 22,
      user: 'wowza-mbox',
      password: 'mbox1423'
  }).then(() => {
    return sftp.put(dataStream, remote);
  }).then(res => {
    console.log(res, 'Uploaded file to sftp');
    return sftp.end();
  }).catch(err => {
    console.log(err, 'catch error');
  });
}

function fastPut(filePath, remote) {
  const sftp = new Client();
  sftp.connect({
    host: 'stream.hcmue.space',
      port: 22,
      user: 'wowza-mbox',
      password: 'mbox1423'
  }).then(() => {
    return sftp.fastPut(filePath, remote);
  }).then(res => {
    console.log(res, 'Fast uploaded file to sftp');
    return sftp.end();
  }).catch(err => {
    console.log(err, 'catch error');
  });
}
