import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  frontend_url: process.env.FRONTEND_URL,
  backend_image_url: process.env.BACKEND_IMAGE_URL,
  port: process.env.PORT || 4000,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_pass_secret: process.env.RESET_PASS_TOKEN,
    reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  },
  reset_pass_link: process.env.RESET_PASS_LINK,
  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },

  // s3: {
  //   aws_s3_region: process.env.AWS_S3_REGION,
  //   aws_s3_access_key: process.env.AWS_S3_ACCESS_KEY,
  //   aws_s3_secret_key: process.env.AWS_S3_SECRET_KEY,
  //   aws_s3_bucket: process.env.AWS_S3_BUCKET,
  // },

  s3: {
    do_space_endpoint: process.env.DO_SPACE_ENDPOINT,
    do_space_accesskey: process.env.DO_SPACE_ACCESS_KEY,
    do_space_secret_key: process.env.DO_SPACE_SECRET_KEY,
    do_space_bucket: process.env.DO_SPACE_BUCKET,
  },
};
