build: 
	rm -rf ./build 
	mkdir build
	cp -r ./server/* ./build
	cp ./server/.env ./build/
	mkdir ./build/build
	cd ./react-client && npm run build && cd .. && cp -r ./react-client/build/* ./build/build/



