# Dottie - Menstrual Health Assessment App

## Overview

Dottie is a mobile-friendly web application designed to provide personalized menstrual health assessments for teens and young adults. The app guides users through a series of questions about their menstrual cycle and provides educational information, personalized insights, and evidence-based recommendations based on their responses.

![Dottie App](https://placeholder.svg?height=300&width=150)

## Features

- **Comprehensive Assessment**: Six-question assessment covering cycle length, period duration, flow heaviness, pain level, and associated symptoms
- **Educational Content**: Informative sections about typical menstrual patterns and symptoms
- **Age-Appropriate Guidance**: Content tailored to different age groups
- **Personalized Results**: Analysis of the user's menstrual health based on their responses
- **Custom Recommendations**: Practical advice based on assessment results
- **Resource Library**: Curated resources for further learning and support
- **Privacy-Focused**: No personal health information is stored

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Getting Started

Here’s an updated version of your `README.md` with additional details and improvements for clarity:

---

## Dottie App

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version `18.0.0` or later.
- **npm** or **yarn**: Package managers for installing dependencies.

To check your current Node.js and npm versions, run:
```bash
node -v
npm -v
```

If you don’t have Node.js installed, follow these steps:

#### **Installing Node.js**

1. **Using `nvm` (Recommended)**:
   - Install `nvm` (Node Version Manager):
     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
     ```
   - Restart your terminal or reload your shell:
     ```bash
     source ~/.zshrc  # or ~/.bashrc for bash or export NVM_DIR="$HOME/.nvm" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
     ```
   - Install the latest LTS version of Node.js:
     ```bash
     nvm install --lts
     ```

2. **Using the Official Installer**:
   - Download the latest LTS version from the [official Node.js website](https://nodejs.org/).
   - Follow the installation instructions for your operating system.

3. **Using a Package Manager**:
   - On macOS (using Homebrew):
     ```bash
     brew install node
     ```
   - On Linux (using `apt`):
     ```bash
     sudo apt update
     sudo apt install nodejs npm
     ```

---

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lmcrean/dottie.git
   cd dottie-app
   ```

2. Install dependencies:
   - Using **npm**:
     ```bash
     npm install
     ```
   - Using **yarn**:
     ```bash
     yarn install
     ```

3. Set up environment variables (if required):
   - Create a `.env` file in the root directory.
   - Add necessary environment variables (e.g., API keys, database URLs).

---

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

### Building for Production

1. Build the application:
   ```bash
   npm run build
   ```
   or
   ```bash
   yarn build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```
   or
   ```bash
   yarn start
   ```

---

### Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your commit message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request on GitHub.

---

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### Support

If you encounter any issues or have questions, please [open an issue](https://github.com/lmcrean/dottie.git/issues) on GitHub.

---

This updated `README.md` provides clear instructions for setting up the project, running it, and contributing. Let me know if you need further adjustments!