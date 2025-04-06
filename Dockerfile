FROM postgres:latest

# Set environment variables with default values
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=mydb

# Copy initialization scripts
COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432

# Set the data directory
VOLUME ["/var/lib/postgresql/data"]

# Default command
CMD ["postgres"]