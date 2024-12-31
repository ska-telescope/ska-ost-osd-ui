export const shiftCreatePath = `shifts/create`;

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
      return `shift/update/${shiftId}`;
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
      return `shift_log_comments`;
    case 'id':
      return `shift_log_comments/${shiftLogCommentId}`;
    case 'image':
      return `shift_log_comments/upload_image/${shiftLogCommentId}`;
    case 'imageDownload':
      return `shift_log_comments/download_images/${shiftLogCommentId}`;
    default:
      throw new Error(`Invalid path type: ${pathToCreate}`);
  }
};
