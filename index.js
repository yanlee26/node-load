//文件下载
var fs = require("fs");
var path = require("path");
var rimraf = require("rimraf");
const urllib = require('urllib');
const compressing = require('compressing');


//创建文件夹目录
function createDir(name = 'all') {
  const dirPath = path.join(__dirname, name);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  } 
  return dirPath
}


async function handleRemoteGZ(url, dirName, dirPath = createDir()) {
  try {
    const {
      res
    } = await urllib.request(url, {
      streaming: true,
      followRedirect: true,
    })
    await compressing.tgz.uncompress(res, dirPath)
    fs.renameSync(`${dirPath}/dist`, `${dirPath}/${dirName}`)
    console.log(`uncompress ${dirName} done`)
  } catch (e) {
    console.error(e);
  }

}

const dists = [{
  url: `http://172.16.54.12:3000/bow-artifact/project-20/gitlab-pipeline-62808-dist.tar.gz`,
  name: 'homework'
}, {
  url: `http://172.16.54.12:3000/bow-artifact/project-13/gitlab-pipeline-62813-dist.tar.gz`,
  name: 'discuss'
}, {
  url: `http://172.16.54.12:3000/bow-artifact/project-16/gitlab-pipeline-62806-dist.tar.gz`,
  name: 'message'
}, {
  url: `http://172.16.54.12:3000/bow-artifact/project-17/gitlab-pipeline-62804-dist.tar.gz`,
  name: 'survey'
}]

function handleAllGZs(dists, dirPath = createDir()) {
  rimraf(dirPath, async (e) => {
    // console.log('初始化成功', e);
    for (let {
        url,
        name
      } of dists) {
      await handleRemoteGZ(url, name, dirPath);
    }
  });
}

handleAllGZs(dists)