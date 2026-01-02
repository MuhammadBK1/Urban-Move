/**
 * Environment variable checker for debugging
 */

export const checkMapboxToken = () => {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  console.group('🔍 Environment Variable Check');
  console.log('Token exists:', !!token);
  console.log('Token type:', typeof token);
  console.log('Token length:', token?.length || 0);
  console.log('Token value (first 30 chars):', token ? token.substring(0, 30) + '...' : 'undefined');
  console.log('All VITE_ env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
  console.groupEnd();
  
  return {
    exists: !!token,
    isValid: !!token && token.trim().length > 0 && (token.startsWith('pk.') || token.startsWith('sk.')),
    value: token
  };
};

