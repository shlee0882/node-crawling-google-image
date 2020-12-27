const GoogleImages = require('google-images');
let url = require('url');
let request = require('request');
const fs = require('fs');
var zip = new require('node-zip')();
 
// ** 8라인 본인의 검색엔진 ID와 API_KEY로 교체 필수
const client = new GoogleImages('검색엔진 ID', 'API_KEY');
 
const keyWord = "조현영";
const pageStVal = 1;
const pageEndVal = 201;
 
let saveDir = __dirname + "/"+keyWord;
 
if(!fs.existsSync(saveDir)){
    fs.mkdirSync(saveDir);
}
 
// 이미지 검색
const searchFunc = (pageStVal) =>{
    client.search(keyWord,  {page: pageStVal, size: 'large'}).then(images => {
        images.forEach(img => {
            console.log(img);
            let filePath = url.parse(img.url).pathname;
            let newFilePath = filePath.replace(/[^a-zA-Z0-8\.]+/g, '_');
            let localFilePath = saveDir + "/" + newFilePath;
            let pattern = /\.(jpg|jpeg|png|gif)\b/; 
            
            // 파일길이가 200 미만이고 이미지 파일인지 체크
            if(newFilePath.length<200){
                try {
                    // 이미지 파일확장자가 아닐경우 강제로 이미지 확장자 변환
                    if(!pattern.test(newFilePath)){
                        localFilePath = localFilePath + '.jpg';
                    }
                    request.get(img.url).on('error', function(err) {
                        console.log('request error1:', err);
                    }).pipe(
                        fs.createWriteStream(localFilePath).on('close', function() {})
                    );
                } catch (err) {
                    console.log('request error2:', err);
                }
            };
        });
        compareTwoVal(pageStVal, pageEndVal);
    }).catch(error => {
        console.log(">>>>>>>>>>>>>>>>>>>"+error);
        console.log("모든 이미지를 수집했습니다.");
        makeImgToZip();
        return;
    });
}
 
// 이미지 압축파일 만들기
const makeImgToZip = () =>{
    var zipName = keyWord+".zip";
    var someDir = fs.readdirSync(__dirname+"/"+keyWord);
    var newZipFolder = zip.folder(keyWord);
    
    for(var i = 0; i < someDir.length; i++){
        newZipFolder.file(someDir[i], fs.readFileSync(__dirname+"/"+keyWord+"/"+someDir[i]),{base64:true});
    }
    var data = zip.generate({base64:false,compression:'DEFLATE'}); 
    fs.writeFile(__dirname +"/"+ zipName, data, 'binary', function(err){
        if(err){
            console.log(err);
        }
    });
}
 
// 페이징 검색
const compareTwoVal = (pageStVal, pageEndVal) =>{
    if(pageStVal<=pageEndVal){
        setTimeout(function() {
            pageStVal += 10;
            console.log("pageStVal: >>>>>>>>"+pageStVal);
            console.log("pageEndVal: >>>>>>>>"+pageEndVal);
            searchFunc(pageStVal);
        }, 500);
    }else{
        console.log("모든 이미지를 수집했습니다.");
        makeImgToZip();
        return;
    }
}
 
// 이미지 수집 시작
searchFunc(pageStVal);