import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ApoyosCard } from './apoyosCard';

test('muestra el título de la tarjeta', () => {
  render(
    <ApoyosCard
      titulo="Sip n Seal Adoption"
      imagen="fake.png"
      descripcion="Help support the rescue"
      link="https://mmsc.org"
    />
  );

  // comprobación
  expect(screen.getByRole('heading', { name: /sip n seal adoption/i })).toBeInTheDocument();
});