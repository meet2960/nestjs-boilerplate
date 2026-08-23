export const mimeTypeMap: Record<string, string> = {
  // Images
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/tiff': 'tiff',
  'image/x-icon': 'ico',
  'image/heic': 'heic',

  // Audio
  'audio/midi': 'midi',
  'audio/mpeg': 'mp3',
  'audio/webm': 'weba',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/aac': 'aac',
  'audio/flac': 'flac',
  'audio/x-wav': 'wav',

  // Video
  'video/mp4': 'mp4',
  'video/mpeg': 'mpeg',
  'video/ogg': 'ogv',
  'video/webm': 'webm',
  'video/x-msvideo': 'avi',
  'video/3gpp': '3gp',
  'video/x-flv': 'flv',
  'video/quicktime': 'mov',
  'video/x-matroska': 'mkv',

  // Documents
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'pptx',
  'text/plain': 'txt',
  'text/csv': 'csv',
  'text/html': 'html',
  'application/json': 'json',
  'application/xml': 'xml',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/rtf': 'rtf',

  // Compressed Files
  'application/zip': 'zip',
  'application/x-tar': 'tar',
  'application/x-7z-compressed': '7z',
  'application/gzip': 'gz',
  'application/x-rar-compressed': 'rar',

  // Fonts
  'font/woff': 'woff',
  'font/woff2': 'woff2',
  'font/ttf': 'ttf',
  'font/otf': 'otf',

  // Executables
  'application/x-msdownload': 'exe',
  'application/x-sh': 'sh',
  'application/x-bzip': 'bz',
  'application/x-bzip2': 'bz2',
  'application/vnd.apple.installer+xml': 'mpkg',

  // Others
  'application/octet-stream': 'bin',
  'application/vnd.android.package-archive': 'apk',
  'application/x-iso9660-image': 'iso',
};
