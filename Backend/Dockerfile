# Dockerfile pour le backend Express
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json
COPY package*.json ./

# Nettoyer le cache npm et installer les dépendances
RUN npm cache clean --force && \
    rm -f package-lock.json && \
    npm install --only=production && \
    npm cache clean --force

# Copier tout le code source
COPY . .

# Exposer le port
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]