# Pixl Technical Test - Event Management Platform

A modern web application for managing events, handling user authentication with role-based access control, and processing payments via Stripe. Built with Next.js, Prisma, PostgreSQL, and Docker.

![Tech Stack](https://via.placeholder.com/800x200.png?text=Next.js+Prisma+PostgreSQL+TailwindCSS+Docker)

## Key Features
- **Event Management**: CRUD operations for events with rich UI
- **Role-Based Authentication**: 
  - JWT token auth from cookies
  - you can add more users modifying frontend/prisma/seed.ts file
- **Payment Integration**: Secure payment processing via Mercado Pago
- **Responsive Design**: Desktop-Only with TailwindCSS
- **Containerized Architecture**: Dockerized services for easy deployment

## Technologies Used
- **Next.js 15**: React framework for server-side rendering
- **Prisma**: Modern ORM for PostgreSQL
- **TailwindCSS**: Utility-first CSS framework
- **Docker**: Containerization for services
- **PostgreSQL**: Relational database system
- **Node.js 20**: JavaScript runtime environment

## Development Setup

### Prerequisites
- Docker 20.10+
- Docker Compose 2.20+
- Node.js 20.x
- PostgreSQL 13

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/josebladex/pixl-test
   cd pixl-event-platform
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your actual credentials.

3. Start the Docker containers:
   ```bash
   docker-compose up --build
   ```

### Configuration
Environment variables (`.env`):
```env
# Database
DATABASE_URL="postgresql://user:password@db:5432/mydb"
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=mydb

# Authentication
JWT_SECRET=your-secret-key

# Payments
MERCADO_PAGO_ACCESS_TOKEN=your-access-token

# Application
NEXT_PUBLIC_URL=http://localhost:3000
```

## Running the Application
```bash
# Start development stack
docker-compose up

# Access application
http://localhost:3000

# Access database (from docker)
docker compose exec [db-container-id] sh

# Access database (from Prisma Studio)
docker compose exec app npx prisma studio
```

## Project Structure
```
.
├── docker-compose.yml          # Docker Config
├── .dockerignore
├── .env                        # File to edit first
├── frontend                    # Nextjs App
│   ├── app
│   │   ├── actions             # Server actions
│   │   ├── admin               # Admin Event Manager APge
│   │   ├── api
│   │   ├── events              # Public Events Page
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── login               # Login component
│   │   ├── page.tsx
│   │   └── payment
│   ├── components
│   │   ├── icon-menu.tsx
│   │   ├── nav-user.tsx
│   │   └── ui
│   ├── components.json
│   ├── Dockerfile
│   ├── .env                    # Ignore this, is created automatically with prisma component
│   ├── eslint.config.mjs
│   ├── hooks
│   │   └── use-mobile.ts
│   ├── lib
│   │   ├── jwt.ts
│   │   ├── mercadopago.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   ├── middleware.ts
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.mjs
│   ├── .prettierignore
│   ├── .prettierrc
│   ├── prisma
│   │   ├── migrations
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── providers
│   │   └── auth-provider.tsx
│   ├── README.md
│   ├── src
│   │   └── app
│   └── tsconfig.json
├── .gitignore
├── LICENSE
└── README.md                   # This Readme
```

## Development Notes
- **Hot Reloading**: Code changes are immediately reflected in running containers
- **Database Management**:
  - Migrations: Handled automatically on container startup
  - Seeding: Initial users populated through Prisma

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments
- Next.js team for the powerful React framework
- Prisma for modern database tooling
- Mercado Pago for payment processing infrastructure
- TailwindCSS for utility-first CSS framework
```