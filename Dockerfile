FROM node:22-alpine
RUN apk add --no-cache \
    git \
    ffmpeg \
    libwebp-tools \
    python3 \
    make \
    g++
ADD https://api.github.com/repos/Davy7000/SYNAPSE-X/git/refs/heads/main version.json
RUN git clone -b main https://github.com/Davy7000/SYNAPSE-X /rgnk
WORKDIR /rgnk
RUN mkdir -p temp
ENV TZ=Africa/Brazzaville
RUN npm install -g --force yarn pm2
RUN yarn install
CMD ["npm", "start"]
