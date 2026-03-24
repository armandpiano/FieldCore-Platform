#!/usr/bin/env sh
# Husky initialization script
# This script runs automatically when running `npm install` (via husky-init)

echo "🔧 Installing Husky git hooks..."

# Install Husky in the current directory
npx husky install

# Set git hooks path
git config core.hooksPath .husky

echo "✅ Husky git hooks installed successfully!"
echo ""
echo "Available hooks:"
echo "  - pre-commit: Runs lint-staged on staged files"
echo "  - commit-msg: Validates commit messages against conventional commits"
echo ""
echo "To bypass hooks temporarily: git commit --no-verify -m 'message'"
