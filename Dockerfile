FROM python:3.9-bullseye

RUN apt-get update -qq && apt-get install curl -y
RUN curl --silent --location https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install --yes nodejs npm build-essential

WORKDIR /opt/dose-response-app

COPY . .

RUN pip install --upgrade pip && pip install -r requirements.txt

WORKDIR ./frontend
RUN npm install && npm run build

WORKDIR ../
CMD npm run start --prefix frontend & DEBUG=True python -m app.server
