import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';
export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'dfvnwdns2',
      api_key: '942242344158565',
      api_secret: 'cS6S3RRdCRNLctrOhjAGRFci4Gg',
    });
  },
};