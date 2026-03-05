import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function NextImage({ src, alt = '', width, height, style, ...rest }) {
  const raw = typeof src === 'string' ? src : (src?.src ?? '');
  const resolved = useBaseUrl(raw); 

  const w = typeof width === 'number' ? width : width;
  const h = typeof height === 'number' ? height : height;

  return <img src={resolved} alt={alt} width={w} height={h} style={style} {...rest} />;
}
