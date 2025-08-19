# Traffic Light Build Status

A visual traffic light that displays the current build status of your GitHub repository.

## 🚦 How it Works

The traffic light shows your CI/CD build status using three colored lights:

- 🔴 **Red Light**: Build failed or has errors
- 🟡 **Yellow Light**: Build is currently in progress
- 🟢 **Green Light**: Build passed successfully

## 🚀 Features

- **Real-time Status**: Automatically checks build status every 30 seconds
- **Manual Refresh**: Click the refresh button to check status immediately
- **GitHub Actions Integration**: Uses GitHub Actions API to get workflow status
- **Responsive Design**: Works on desktop and mobile devices
- **Visual Feedback**: Animated lights with glow effects

## 📁 Files

- `index.html` - Main HTML structure for the traffic light
- `style.css` - Styling and animations for the traffic light
- `script.js` - JavaScript logic for fetching and displaying build status
- `.github/workflows/ci.yml` - GitHub Actions workflow for CI/CD

## 🔧 Setup

1. **Enable GitHub Actions**: The workflow will run automatically on pushes and pull requests
2. **Enable GitHub Pages** (optional): For hosting the traffic light web interface
   - Go to repository Settings → Pages
   - Select "GitHub Actions" as the source
3. **Access the Traffic Light**: Open `index.html` in a web browser or visit your GitHub Pages URL

## 🎯 Usage

The traffic light will automatically:
- Check the latest workflow run status
- Update the display based on build results
- Refresh every 30 seconds
- Show the last updated timestamp

## 🛠️ Development

To modify the traffic light:

1. **Change colors**: Edit the CSS classes in `style.css`
2. **Adjust timing**: Modify the refresh interval in `script.js`
3. **Add more states**: Extend the status handling in the `setStatus()` method
4. **Customize workflow**: Edit `.github/workflows/ci.yml` for your build process

## 📊 Build Status

The current build status is: [![CI/CD Build Status](https://github.com/PATTASWAMY-VISHWAK-YASASHREE/PROJECT01/actions/workflows/ci.yml/badge.svg)](https://github.com/PATTASWAMY-VISHWAK-YASASHREE/PROJECT01/actions/workflows/ci.yml)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

*Built with ❤️ for visual build status monitoring*