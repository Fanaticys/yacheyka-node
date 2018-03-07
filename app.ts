import appProduction from './app.production';
import appDevelopment from './app.development';

const api = process.env.NODE_ENV === 'prod' ? appProduction : appDevelopment;
export default api;