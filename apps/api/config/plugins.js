module.exports = ({ env }) => {
  const accountId = env('R2_ACCOUNT_ID')
  const bucket = env('R2_BUCKET')
  const accessKeyId = env('R2_ACCESS_KEY_ID')
  const secretAccessKey = env('R2_SECRET_ACCESS_KEY')
  const publicUrl = env('R2_PUBLIC_URL', env('MEDIA_PUBLIC_URL'))
  const endpoint = env('R2_ENDPOINT', accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined)

  const hasR2Config = Boolean(accountId && bucket && accessKeyId && secretAccessKey && publicUrl)

  return {
    upload: {
      config: hasR2Config
        ? {
            provider: 'aws-s3',
            sizeLimit: env.int('UPLOAD_SIZE_LIMIT', 12 * 1024 * 1024),
            providerOptions: {
              baseUrl: publicUrl.replace(/\/$/, ''),
              s3Options: {
                credentials: {
                  accessKeyId,
                  secretAccessKey,
                },
                region: env('R2_REGION', 'auto'),
                endpoint,
                forcePathStyle: true,
                params: {
                  Bucket: bucket,
                },
              },
            },
            actionOptions: {
              upload: {},
              uploadStream: {},
              delete: {},
            },
          }
        : {
            sizeLimit: env.int('UPLOAD_SIZE_LIMIT', 12 * 1024 * 1024),
          },
    },
  }
}
