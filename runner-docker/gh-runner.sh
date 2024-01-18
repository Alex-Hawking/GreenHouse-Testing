CODE_PATH=$1

docker run -v $CODE_PATH:/app/tests -v $VIDEO_HOST_PATH:/app/tests/videos $IMAGE_NAME 