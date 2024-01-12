FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

# Add verbose flag for detailed logging
RUN npm install 

# The following line is for debugging, it will list the contents of the current directory
RUN ls -la

COPY . .

EXPOSE 3003

CMD ["node", "main.js"]
