/**
 * Converting all documents with `dateCreated` and `dateUpdated`
 * to use the canonical `createdAt` and `updatedAt` to avoid inconsistencies and aliases
 */

import Experiment from "../models/Experiment"
// dateCreated and dateUpdated -> createdAt -> updatedAt
// Directory
// Experiment

// dateCreated -> createdAt
// ExperimentCache
// experimentData

// timestamp -> createdAt
// LogEntry

