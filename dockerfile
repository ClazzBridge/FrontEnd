#베이스 이미지를 명시해준다.
FROM node:20-alpine

WORKDIR /FrontEnd

COPY package.json ./

# 추가적으로 필요한 파일들을 다운로드 받는다.
RUN npm i

COPY ./ ./

RUN npm run build  # 빌드 명령어 추가

# 빌드 결과물 위치로 이동
WORKDIR /FrontEnd/build


EXPOSE 3000

#컨테이너 시작 시 실행 될 명령어를 명시해준다.
CMD ["npm", "run", "start"]
