## 개요

구글 검색엔진 사용하여 이미지 크롤링하기
<br><br>

## 설치 및 실행

```code
npm install
node getGoogleImg.js
```

## 수정 및 개선
```code
// 키워드 수정하여 테스트 진행
const keyWord = "조현영";

// 이미지 파일확장자가 아닐경우 jpg로 이미지 확장자 변환
let pattern = /\.(jpg|jpeg|png|gif)\b/; 

if(!pattern.test(newFilePath)){
    localFilePath = localFilePath + '.jpg';
}
```
