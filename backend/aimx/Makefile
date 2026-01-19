APP_NAME=aimx-api

.PHONY: build run test clean generate lint

build:
	go build -o bin/$(APP_NAME) ./cmd/api

run:
	go run ./cmd/api

test:
	go test ./...

generate:
	sqlc generate

clean:
	rm -rf bin

lint:
	go vet ./...
