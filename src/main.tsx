import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider, CSSReset, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "ul, ol": {
        listStyleType: "none",
        padding: 0,
        margin: 0,
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
    <CSSReset />
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
