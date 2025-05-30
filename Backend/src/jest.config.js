/**
 * Configuration Jest pour les tests
 * Fichier : jest.config.js
 */

module.exports = {
  // Environnement de test
  testEnvironment: 'node',
  
  // Répe des tests
  testMatch: [
    '<rootDir>/src/tests/**/*.test.js',
    '<rootDir>/src/tests/**/*.spec.js'
  ],
  
  // Répe à ignorer
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // Configuration de la collecte de couverture
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!**/node_modules/**'
  ],
  
  // Format des rapports de couverture
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov'
  ],
  
  // Répertoire de sortie pour les rapports
  coverageDirectory: 'coverage',
  
  // Seuils de couverture minimaux
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Setup avant les tests
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  
  // Timeout pour les tests
  testTimeout: 10000,
  
  // Affichage détaillé
  verbose: true,
  
  // Couleurs dans la sortie
  colors: true,
  

  
  // Variables d'environnement pour les tests
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  }
};