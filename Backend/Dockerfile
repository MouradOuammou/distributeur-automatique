# Dockerfile pour le backend Express

FROM node:20-alpine

# Créer un utilisateur non-root sécurisé
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers de dépendances avec les bons droits
COPY --chown=nodeuser:nodejs package*.json ./

# Passer à l'utilisateur non-root
USER nodeuser

# Installer uniquement les dépendances de production
RUN npm ci --only=production && npm cache clean --force

# Copier le reste de l'application (code source)
COPY --chown=nodeuser:nodejs . .

# Exposer le port (à adapter selon ton app)
EXPOSE 3000

# Lancer le serveur avec npm start (doit exister dans package.json)
CMD ["npm", "start"]
