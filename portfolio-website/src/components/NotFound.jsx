import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page not-found">
      <p className="index-label">Error 404</p>
      <h1 className="not-found__title">Page not found</h1>
      <p className="muted prose">
        The page you were looking for doesn't exist or has moved.
      </p>
      <p>
        <Link className="btn btn--primary" to="/">
          Back to home
        </Link>
      </p>
    </div>
  );
}
