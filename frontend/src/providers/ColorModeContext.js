import { createContext } from 'react';

const ColorModeContext = createContext({ mode: 'light', toggle: () => {} });
export default ColorModeContext;
