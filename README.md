# Supermart Inventory App

A modern store inventory management application built with React. Manage your inventory with an intuitive spreadsheet-like interface that's easier to use than Excel, with data stored locally in your browser.

## Features

- **Spreadsheet Interface** - Familiar grid layout for easy data entry and viewing
- **Local Storage** - All data stored in your browser, no server required
- **Export Capabilities** - Download your inventory as CSV or Excel files
- **Fast & Lightweight** - Quick loading times and responsive interface
- **No Installation Required** - Runs entirely in your browser

## Tech Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui components

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Local Development

1. Clone the repository
```bash
git clone https://github.com/proc3ssa/supermart.git
cd supermart
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Docker Deployment

### Using Docker Hub

```bash
docker pull proc3sa/supermart:1.0.0
docker run -d -p 8080:8080 proc3sa/supermart:1.0.0
```

### Using GitHub Container Registry

```bash
docker pull ghcr.io/proc3ssa/supermart:1.0.0
docker run -d -p 8080:8080 ghcr.io/proc3ssa/supermart:1.0.0
```

### Build Docker Image Locally

```bash
make build
make run
```

Access the app at `http://localhost:8080`

## Usage

1. **Add Items** - Click the add button to create new inventory entries
2. **Edit Data** - Click any cell to edit product information
3. **Search & Filter** - Use the search bar to find specific items
4. **Export Data** - Click the export button and choose CSV or Excel format
5. **Data Persistence** - Your data is automatically saved to browser local storage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Contact

For questions or support, please open an issue on GitHub.
