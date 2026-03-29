#!/bin/bash

echo "Started Removing dist, logs, metadata.ts Folders..."

rm -rf dist || { echo "Failed to remove dist folder"; }
rm -rf logs || { echo "Failed to remove logs folder"; }
echo

echo "Removed dist, logs Folders Successfully!!!"