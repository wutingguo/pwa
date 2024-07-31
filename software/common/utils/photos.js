import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import JSZipUtils from 'jszip-utils';

const getTextCont = (groups) => {
  let textContent = "";
  groups.forEach((group, index) => {
    const { groupId, name, imageList, imageUrl } = group;
    let folderText = ''
    if (imageList && !!imageList.length) {
      let imagesText = 'images:'
      imageList.forEach(item => {
        const { image_name } = item;
        if (image_name) {
          imagesText = imagesText + `${image_name},`
        }
      });
      const newName = name || `人物${index + 1}`
      folderText = `folder:${newName}\n` + imagesText + '\n'
    }
    textContent = textContent + folderText
  });
  return textContent;
}

export const getPhotos = (groups) => {
  const textContent = getTextCont(groups);
  JSZipUtils.getBinaryContent(`${window.location.origin}/clientassets-cunxin-saas/portal/images/pc/gallery/tools.zip`, function(err, data) {
    if (err) throw err;
    // 解析Zip文件
    JSZip.loadAsync(data)
    .then(function(zip) {
        // 向Zip中添加一个文件
        zip.file("分片结果.txt", textContent);

        // 检查Zip内容
        zip.forEach(function (relativePath, zipEntry) {
          console.log('data111', relativePath, zipEntry.name);
        });

        // 将Zip打包成Blob对象并下载
        return zip.generateAsync({ type:"blob" });
    })
    .then(function(content) {
        saveAs(content, "分片工具.zip");
    }).catch(function(err) {
      console.error('发生错误:', err);
    });
  });
}

export const  generateAndDownloadFiles = (groups) => {
  // 创建一个JSZip实例
  let zip = new JSZip();
  const textContent = getTextCont(groups);
  console.log('text', textContent);

  // 将文本内容写入一个文本文件
  zip.file("photos.txt", textContent);

  // 创建一个 .bat 文件内容
  let batContent = `@echo off  
  setlocal enabledelayedexpansion  
    
  set "current_folder=%~dp0"  
  if not "!current_folder:~-1!"=="\\" set "current_folder=!current_folder!\\!"  
  
  set "txt_file=photos.txt" 
  
  for /F "tokens=1,* delims=:" %%a in (!current_folder!\\!txt_file!) do (  
      if /I "%%a"=="folder" (  
          set "folder_name=%%b"  
          set "folder_path=!current_folder!\\!folder_name!"  
  
          if not exist "!folder_path!\\" (  
              mkdir "!folder_path!"  
              echo 创建了文件夹: !folder_path!  
          ) else (  
              echo 文件夹已存在: !folder_path!  
          )  
      ) else if /I "%%a"=="images" (  
          for %%i in (%%b) do (  
              for /F "delims=," %%j in ("%%i") do (  
                  for %%f in ("!current_folder!\\%%~j.*") do (  
                      if exist "%%f" (  
                          copy "%%f" "!folder_path!"  
                          echo 已将文件 %%~nxf 复制到 !folder_path!  
                      ) else (  
                          echo 警告: 文件 %%~j 不存在或没有匹配的图片文件  
                      )  
                  )  
              )  
          )  
      )  
  )  
    
  endlocal`;
  // 将 .bat 内容写入文件
  zip.file("photos.bat", batContent, { binary: false });

  // 生成压缩文件
  zip.generateAsync({type:"blob"})
    .then(function(content) {
      // 使用FileSaver库保存压缩文件
      saveAs(content, "photos.zip");
    });
}

