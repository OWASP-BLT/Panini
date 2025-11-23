# Banned Apps 

This repository contains the standalone **Banned Apps** Django application, extracted from the BLT project to improve maintainability, modularity, and ownership. It provides:

- A `BannedApp` Django model
- Admin integration
- JSON search API endpoint
- HTML template for displaying banned applications
- Django migrations
- Fixtures
- Clean separation from the BLT monorepo

This module preserves commit history extracted from the BLT repository using git-filter-repo.


---

## 🚀 Features

### ✔ BannedApp Model  
Tracks information about banned applications:

- App name  
- App type  
- Country  
- Reason for ban  
- Ban date  
- Source URL  
- Active status  

### ✔ Views  
- Template view: displays a simple banned apps page  
- JSON endpoint: `/banned_apps/search/?country=<query>`  

### ✔ Admin Integration  
The app registers `BannedApp` under Django admin with basic columns.

### ✔ Fixtures & Migrations  
A complete database migration and fixture file (`banned_apps.json`) are included.

---

## 📦 Installation

Install directly from GitHub in your Django project:

```bash
pip install git+https://github.com/OWASP-BLT/Panini.git#egg=banned_apps
```
## Django Setup

Add the app to your INSTALLED_APPS:

```python
INSTALLED_APPS = [
    ...
    "banned_apps",
]
```

Include its URL routes:

```bash
from django.urls import include, path

urlpatterns = [
    ...
    path("banned_apps/", include("banned_apps.urls")),
]

```

# Project Structure 

```pgsql
banned_apps/
  ├── __init__.py
  ├── admin.py
  ├── apps.py
  ├── fixtures/
  │     └── banned_apps.json
  ├── migrations/
  │     └── 0001_initial.py
  ├── models.py
  ├── templates/
  │     ├── banned_apps/
  │     │     └── banned_apps.html
  │     └── includes/
  │           ├── header.html
  │           └── sidenav.html
  ├── urls.py
  └── views.py
```

## Running Migrations

After installation:

```bash
python manage.py migrate banned_apps
```

To load sample data:
```bash
python manage.py loaddata banned_apps
```

## Development

Clone the repository:
```bash
git clone https://github.com/OWASP-BLT/Panini.git
cd Panini
```

Install the module in editable mode:
```bash
pip install -e .
```

## Contributing

1. Fork the Panini repo

2. Create a feature branch

3. Commit your changes

4. Submit a PR to the Panini repository

5. Follow Django coding conventions