#!/bin/bash

# AI Fitness Platform - Backend Starter Script

echo "Starting all backend services..."

# Function to run a service in the background
run_service() {
    local service_dir=$1
    local service_name=$2
    echo "Starting $service_name..."
    (cd "$service_dir" && mvn spring-boot:run) &
}

# Run each service
run_service "user-service" "User Service"
run_service "exercise-service" "Exercise Service"
run_service "workout-service" "Workout Service"
run_service "diet-service" "Diet Service"
run_service "ai-media-service" "AI Media Service"

echo "All services are starting in the background."
echo "You can check individual logs or use 'lsof -i :8081' (up to 8085) to verify they are up."
wait
