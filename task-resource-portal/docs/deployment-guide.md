# Deployment Guide

 - Build production bundle: `ng build --configuration production`
 - Serve via static hosting (NGINX, Azure Blob, S3 + CloudFront) from `dist/task-resource-portal`
 - Ensure API URL (`API_CONFIG`) points to production API in environment variable or pipeline.
 - For Docker: build a small NGINX container serving `dist` (Dockerfile not included yet).
