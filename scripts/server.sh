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

# List of filenames to check
files=(".env" ".env.$environment" ".env.local" "envs/.env.$environment.local")

# Iterate over each filename
for file in "${files[@]}"; do
    # Check if the file exists
    if [ -f "envs/$file" ]; then
        source "envs/$file"
    fi
done

export PORT=$PORT

if [ -f "envs/.env.local" ]; then
    export OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID
    export OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET
    export NEXTAUTH_SECRET=$NEXTAUTH_SECRET
    export NEXTAUTH_URL=$NEXTAUTH_URL
fi

echo "Running pnpm next $command in $environment environment"

# Now you can use the variables in your script
pnpm next $command
