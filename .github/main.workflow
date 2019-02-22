workflow "Test ghpages" {
  on = "push"
  resolves = ["Deploy to GitHub Pages"]
}

action "Deploy to GitHub Pages" {
  uses = "./"
  env = {
    BUILD_DIR = "website"
  }
  secrets = ["GH_PAT"]
}
