FROM node:latest
ADD package.json package.json
RUN npm install --production 
ADD . .
EXPOSE 3000
CMD [ "npm", "start" ]

