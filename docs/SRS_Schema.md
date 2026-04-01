# SRS + Repository Schema

## Goal
This document defines the initial folder/file layout for the **hire-a-human-scratch** project.

## Repository Tree (v1)
/
│
├── database/                # Database se related saara kaam yahan hoga
│   ├── schema.sql           # (Hum banayenge) Raw SQL table creation codes
│   └── triggers.sql         # (Hum banayenge) SQL triggers yahan rahenge
│
├── src/                     # Tera actual Python engine yahan aayega
│   ├── models/              # Python OOPs classes (Engineer, Recruiter)
│   ├── mcp/                 # Tera FastMCP server code
│   └── agent/               # LangGraph aur Memory ka code
│
├── docs/                    # System Design aur Architecture
│   └── SRS_Schema.md        # <-- Aaj ka pehla file
│
├── requirements.txt         # Libraries ki list (Baad mein use hoga)
└── main.py                  # Engine start karne ka main switch (Baad mein)

## Notes
- `database/schema.sql` and `database/triggers.sql` will hold raw SQL for tables and triggers.
- `src/` is reserved for the Python implementation; subfolders are placeholders for now.
