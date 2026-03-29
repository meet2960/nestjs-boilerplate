#!/bin/bash

# Restart the service
echo "Restarting the Main Service.."
systemctl restart point_machine_backend.service
if [ $? -ne 0 ]; then
    echo "Failed to restart the service. Exiting."
    exit 1
fi

# Check the status of the service
echo "Checking the Service status.."
systemctl status point_machine_backend.service

# Restart Nginx 
echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "DONE"