# Panini

Panini is the standalone **Banned Applications** Django module extracted from the BLT project.  
It contains everything needed to manage, display, and query banned applications, while being fully decoupled from the BLT monorepo.

This module preserves commit history extracted from BLT using `git-filter-repo`.

---

##  Features

###  BannedApp Model  
Tracks information about banned applications:

- App name  
- App type  
- Country  
- Reason for ban  
- Ban date  
- Source URL  
- Active status  

###  Views  
- Template view: displays the banned apps page  
- JSON endpoint: `/panini/search/?country=<query>`

###  Admin Integration  
The app registers `BannedApp` under Django admin.

###  Fixtures & Migrations  
Includes:

- Initial migration (`0001_initial.py`)  
- Sample fixture file (`panini.json`)

---

##  Installation

Install directly from GitHub:

```bash
pip install git+https://github.com/OWASP-BLT/Panini.git#egg=panini
```

### Django Setup

Add the app to your Django project:

```bash
INSTALLED_APPS = [
    ...
    "panini",
]
```

Include its URL routes:
```bash
from django.urls import include, path

urlpatterns = [
    ...
    path("panini/", include("panini.urls")),
]
```

### Project Structure

panini/
  ├── __init__.py
  ├── admin.py
  ├── apps.py
  ├── fixtures/
  │     └── panini.json
  ├── migrations/
  │     └── 0001_initial.py
  ├── models.py
  ├── templates/
  │     ├── panini/
  │     │     └── panini.html
  │     └── includes/
  │           ├── header.html
  │           └── sidenav.html
  ├── urls.py
  └── views.py

Running Migrations
```bash
python manage.py migrate panini
```

Load sample data:
```bash
python manage.py loaddata panini
```

## Development

Clone the repository:
```bash
git clone https://github.com/OWASP-BLT/Panini.git
cd Panini
```

Install in editable mode:
```bash
pip install -e .
```