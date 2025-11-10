# AION Studio

> Visual API Designer - Figma for Backend

![AION Studio](https://via.placeholder.com/1200x630/4F46E5/ffffff?text=AION+Studio)

**Design your APIs visually. Export to code instantly.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/aion-studio.svg)](https://github.com/YOUR_USERNAME/aion-studio/stargazers)
[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://YOUR_USERNAME.github.io/aion-studio)

## ✨ Features

### Entity Designer
- 🎨 **Drag & Drop** - Position entities anywhere on canvas
- 📝 **All Field Types** - string, int, float, boolean, uuid, email, timestamp, enum, json
- 🎯 **Decorators** - @unique, @indexed, @min, @max, @precision, @pattern
- 🔗 **Relationships** - Visual relationship mapping (→ belongs to, ← has many)
- 📊 **Arrays** - Support for array fields with []
- 🏷️ **Enums** - Define enum values inline

### Endpoint Designer
- 🌐 **All HTTP Methods** - GET, POST, PUT, PATCH, DELETE
- 📍 **Path Parameters** - Support for /users/:id syntax
- 📤 **Request Bodies** - Define required and optional fields
- 📥 **Return Types** - Single entities or arrays
- ⚠️ **Error Handling** - Define error responses with status codes
- ⚡ **Endpoint Decorators** - @rate_limit, @auth, @cache

### Developer Experience
- 💻 **Live Code Preview** - See generated AION schema instantly
- 📋 **Copy to Clipboard** - One-click code copy
- 💾 **Download Schema** - Export .aion file
- 🎨 **Professional UI** - Clean, intuitive interface
- 🔄 **Mode Switching** - Toggle between Entities and Endpoints

## 🚀 Quick Start

### Online (No Installation)

Try it now: **[https://YOUR_USERNAME.github.io/aion-studio](https://YOUR_USERNAME.github.io/aion-studio)**

### Local Development
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/aion-studio.git
cd aion-studio

# Install dependencies
npm install

# Start development server
npm run dev

# Visit: http://localhost:5173
```

## 📖 How to Use

1. **Configure API** - Set API name and version in the header
2. **Add Entities** - Click "Add Entity" and position on canvas
3. **Add Fields** - Click "+ Add Field" and configure type, decorators
4. **Create Relationships** - Use the link icon to connect entities
5. **Add Endpoints** - Switch to Endpoints mode and define routes
6. **Configure Endpoints** - Set method, path, body, returns, errors
7. **Download Schema** - Click "Download" to export .aion file
8. **Generate Code** - Use with [aion-cli](https://github.com/YOUR_USERNAME/aion-cli)

## 🎯 Example Workflow
```bash
# 1. Design API in Studio
# 2. Download schema.aion
# 3. Generate code with CLI
aion generate schema.aion -o ./generated

# 4. Start mock server
aion mock schema.aion

# 5. Visit: http://localhost:3000/docs
```

## 🔗 Ecosystem

- **[AION CLI](https://github.com/YOUR_USERNAME/aion-cli)** - Code generation tool
- **[AION Docs](https://github.com/YOUR_USERNAME/aion-docs)** - Documentation
- **[AION Examples](https://github.com/YOUR_USERNAME/aion-examples)** - Example projects

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library

## 🏗️ Project Structure