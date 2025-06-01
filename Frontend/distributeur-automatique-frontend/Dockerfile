
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copier les fichiers package.json et lock (important pour npm ci)
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste du code source
COPY . .

# Compiler le projet pour la production
RUN npm run build


FROM nginx:stable-alpine AS production-stage

# Copier les fichiers build vers le dossier HTML de nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Configuration personnalisée de nginx (si tu en as une)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port
EXPOSE 80

# Lancer nginx
CMD ["nginx", "-g", "daemon off;"]
