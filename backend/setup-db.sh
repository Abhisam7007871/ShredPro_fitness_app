#!/bin/bash

# AI Fitness Platform - Database Setup Script

echo "Initializing PostgreSQL role and databases..."

# Function to run psql commands
run_psql() {
    psql -d postgres -c "$1"
}

# 1. Create the 'postgres' role if it doesn't exist
echo "Checking for 'postgres' role..."
ROLE_EXISTS=$(run_psql "SELECT 1 FROM pg_roles WHERE rolname='postgres'" | grep -c 1)

if [ "$ROLE_EXISTS" -eq 0 ]; then
    echo "Creating 'postgres' role..."
    run_psql "CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'postgres';"
else
    echo "Role 'postgres' already exists."
fi

# 2. Create the required databases
databases=("aifitness_users" "aifitness_exercises" "aifitness_workouts" "aifitness_diet")

for db in "${databases[@]}"; do
    echo "Checking for database '$db'..."
    DB_EXISTS=$(run_psql "SELECT 1 FROM pg_database WHERE datname='$db'" | grep -c 1)
    
    if [ "$DB_EXISTS" -eq 0 ]; then
        echo "Creating database '$db'..."
        run_psql "CREATE DATABASE $db OWNER postgres;"
    else
        echo "Database '$db' already exists."
    fi
done

echo "Database initialization complete."
