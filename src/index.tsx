/*
 * index.tsx
 * Copyright: Microsoft 2019
 *
 * Main page for generic plot visualizer.
 */

import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { initializeIcons } from '@fluentui/react/lib/Icons';

import PlotVisualizer from './PlotVisualizer';

initializeIcons();
ReactDOM.render(<PlotVisualizer />, document.getElementById('root'));
