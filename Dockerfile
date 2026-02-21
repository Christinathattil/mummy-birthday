# Deployable container for the Flask backend (and optional static files)
# Multi-stage build keeps final image small

# ---- Build stage ----
FROM python:3.11-slim AS build
WORKDIR /app

# Install build dependencies
RUN apt-get update -qq \
    && apt-get install --no-install-recommends -y build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirement spec first to leverage Docker cache
COPY backend/requirements.txt ./requirements.txt
RUN pip install --disable-pip-version-check --no-cache-dir -r requirements.txt --prefix=/install

# ---- Runtime stage ----
FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/install/bin:$PATH" \
    PORT=8080

WORKDIR /app

# Copy installed packages from build stage
COPY --from=build /install /usr/local

# Copy source code
COPY backend/ /app/

# Expose the HTTP port
EXPOSE 8080

# Default command runs the app via Gunicorn – adjust workers based on Fly.io VM size
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
