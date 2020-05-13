//文件下载
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const urllib = require('urllib');
const compressing = require('compressing');
const {
  dists
} = require('./dists')


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