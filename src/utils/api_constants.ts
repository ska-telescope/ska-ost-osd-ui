export const shiftCreatePath = `shift`;

export const shiftCurrentPath = `current_shift`;

export const config = {
  headers: {
    accept: 'application/json',
    'content-type': 'multipart/form-data'
  }
};

export const createShiftPath = (shiftId: string, pathToCreate: string): string => {
  switch (pathToCreate) {
    case 'id':
      return `shift?shift_id=${shiftId}`;
    case 'end':
      return `shift/end/${shiftId}`;
    case 'update':
      return `shift/${shiftId}`;
    default:
      throw new Error(`Invalid path type: ${pathToCreate}`);
  }
};

export const createShiftCommentPath = (shiftCommentId: string, pathToCreate: string): string => {
  switch (pathToCreate) {
    case 'basePath':
      return `shift_comment`;
    case 'id':
      return `shift_comment/${shiftCommentId}`;
    case 'image':
      return `shift_comment/upload_image/${shiftCommentId}`;
    case 'imageDownload':
      return `shift_comment/download_images/${shiftCommentId}`;
    default:
      throw new Error(`Invalid path type: ${pathToCreate}`);
  }
};

export const createShiftLogCommentPath = (
  shiftLogCommentId: string,
  pathToCreate: string
): string => {
  switch (pathToCreate) {
    case 'basePath':
      return `shift_log_comment`;
    case 'id':
      return `shift_log_comment/${shiftLogCommentId}`;
    case 'image':
      return `shift_log_comment/upload_image/${shiftLogCommentId}`;
    case 'imageDownload':
      return `shift_log_comment/download_images/${shiftLogCommentId}`;
    default:
      throw new Error(`Invalid path type: ${pathToCreate}`);
  }
};

export const createShiftAnnotationPath = (
  shiftAnnotationId: string,
  pathToCreate: string
): string => {
  switch (pathToCreate) {
    case 'basePath':
      return `shift_annotation`;
    case 'id':
      return `shift_annotation/${shiftAnnotationId}`;
    case 'get':
      return `shift_annotation?shift_id=${shiftAnnotationId}`;
    default:
      throw new Error(`Invalid path type: ${pathToCreate}`);
  }
};
