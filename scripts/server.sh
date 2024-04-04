#!/bin/bash
set -e

command="$1"

# Check if command is not one of dev, build, or start
if [ "$command" != "dev" ] && [ "$command" != "build" ] && [ "$command" != "start" ]; then
    exit 1
fi

env="$2"

# Set environment based on the value of $var
if [ "$env" = "-d" ]; then
    environment="development"
elif [ "$env" = "-s" ]; then
    environment="staging"
elif [ "$env" = "-p" ]; then
    environment="production"
else
    environment="development"
fi

env_file="envs/.env.$environment"

# Check if the .env file exists
if [ ! -f "$env_file" ]; then
    exit 1
fi

# Source the .env file
source "$env_file"

export PORT=$PORT

echo "Running pnpm next $command in $environment environment"

# Now you can use the variables in your script
pnpm next $command
