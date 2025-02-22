# WeShare Project Conventions

## Branch Naming Conventions

Branches should follow a consistent naming pattern to keep the project organized. Use the following format:
<type>: <short description>

[Optional] Detailed description of changes.
[Optional] Issue reference (e.g., Closes #123)

### Feature Branches
- **Naming pattern:** `feature/<ticket-id>/<short-description>`
- **Example:** `feature/1234/user-login`

### Bugfix Branches
- **Naming pattern:** `bugfix/<ticket-id>/<short-description>`
- **Example:** `bugfix/5678/fix-login-error`

### Hotfix Branches
- **Naming pattern:** `hotfix/<ticket-id>/<short-description>`
- **Example:** `hotfix/9012/resolve-critical-issue`

### Release Branches
- **Naming pattern:** `release/<version>`
- **Example:** `release/1.0.0`

---

## Commit Message Conventions

Commit messages should follow a standardized format to make history easier to navigate:

### Format:
- **Title:** `type(scope): message`
- **Body:** A detailed explanation (if necessary) of what was changed and why.
  - Max 72 characters per line.

### Types:
- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation updates
- **style:** Code style changes (e.g., formatting, missing semicolons)
- **refactor:** Code refactoring without changing functionality
- **test:** Adding or updating tests
- **chore:** Minor changes (e.g., updating dependencies)

## Example Commit Messages  

### ✅ Adding a new feature:  
```bash
git commit -m "feat: add homepage layout"
```

### ✅ Fixing a bug:  
```bash
git commit -m "fix: resolve button alignment issue on mobile"
```

### ✅ Updating documentation:  
```bash
git commit -m "docs: update README with setup instructions"
```

### ✅ Refactoring code (no functional change):  
```bash
git commit -m "refactor: simplify API request logic"
```

### ✅ Adding dependencies:  
```bash
git commit -m "chore: install react-router-dom for navigation"
```
