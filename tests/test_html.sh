#!/bin/bash
if grep -q "doctors" ../index.html && grep -q "services" ../index.html; then
    echo "✅ HTML structure OK"
    exit 0
else
    echo "❌ HTML missing required elements"
    exit 1
fi
