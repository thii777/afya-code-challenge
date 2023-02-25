name: Terraform Deployment
on:
  push:
    branches:
      - main
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v1
        with:
          node-version: '14.x'
      - name: Install Dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Test
        run: npm run test
