import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';

export default function ApiUI() {
  useEffect(() => {
    SwaggerUI({
      url: 'https://petstore.swagger.io/v2/swagger.json',
      dom_id: '#api-ui',
    });
  });
  return (
    <>
      <Helmet>
        <title>API Reference</title>
      </Helmet>
      <div id="api-ui">API</div>
    </>
  );
}
