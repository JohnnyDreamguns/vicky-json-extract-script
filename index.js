const axios = require('axios');
const stream = require('stream');
const { promisify } = require('util');
const fs = require('fs');

if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const filename = process.argv[2];
const path = process.argv[3] || '/Users/johnhodgson/Downloads';

fs.readFile(filename, 'utf8', function (err, data) {
  if (err) throw err;
  const json = JSON.parse(data);
  const urlArr = json.map((item) => item.imgUrl);
  urlArr.forEach((url, i) => {
    downloadFile(url, `${path}/image` + (parseInt(i) + 1) + '.jpg');
  });
});

const finished = promisify(stream.finished);

async function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);
  return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then(async (response) => {
    response.data.pipe(writer);
    return finished(writer); //this is a Promise
  });
}
