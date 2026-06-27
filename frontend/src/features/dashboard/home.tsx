import React from 'react';
import { Link } from 'react-router-dom'
export default function Home() {
  return (
    <main style={{padding:32}}>
      <h1>Bienvenido</h1>
      <p>Esta es la página principal de la migración — diseño pendiente.</p>
      <p>
        <Link to="/login">Ir a Login</Link>
      </p>
    </main>
  )
}
