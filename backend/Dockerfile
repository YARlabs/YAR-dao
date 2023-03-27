FROM golang:1.20-alpine

WORKDIR /app

COPY . ./

RUN go mod tidy && go mod download

ENTRYPOINT go run /app/cmd/daosrv/main.go
