#! /bin/bash
set -euo pipefail

source $NVM_DIR/nvm.sh
corepack enable pnpm
exec "$@"
