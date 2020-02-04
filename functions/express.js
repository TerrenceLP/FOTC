const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const express = require('express')
const cors = require('cors')
const app = express()

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:
app.get('/', (req, res) => res.send("Welconme"));

// Expose Express API as a single Cloud Function:
exports.expressServer = functions.https.onRequest(app)