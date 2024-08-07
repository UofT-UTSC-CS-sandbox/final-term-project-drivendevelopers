// src/setupTests.js
import '@testing-library/jest-dom';
const { TextEncoder, TextDecoder } = require('util');
Object.assign(global, { TextDecoder, TextEncoder });
import { expect } from '@jest/globals';
