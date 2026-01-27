'use client';

import SwaggerUIReact from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type Props = {
  spec: Record<string, unknown>;
};

export default function SwaggerUI({ spec }: Props) {
  return <SwaggerUIReact spec={spec} />;
}
