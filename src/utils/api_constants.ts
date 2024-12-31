export const shiftIdPath = (shiftId: string) => {
  const path = `shift?shift_id=${shiftId}`;
  return path;
};

export const config = {
  headers: {
    accept: 'application/json',
    'content-type': 'multipart/form-data'
  }
};

export const downloadImagePath = (commentId: string) => {
  const path = `shift_comment/download_images/${commentId}`;
  return path;
};

// const path = `shifts/create`;
// const path = `current_shift`;
// const path = `shift/end/${shiftId}`;
// const path = `shifts?query_type=created_between&shift_start=${getTodayDateRange.start}&shift_end=${getTodayDateRange.end}`;
// const path = `shifts/update/${data.shift_id}`;

// const addPath = `shift_comment`;
// const updatePath = `shift_comment/${shiftCommentID}`;
// const path = `shift_comment/upload_image/${shiftCommentID}`;
// const path = `shift_comment/upload_image?shift_id=${shiftId}&shift_operator=${operator}`;

// const path = `shift_log_comments`;
// const path = `shift_log_comments/upload_image/${shiftNewLogCommentID}`;
// const path = `shift_log_comments/upload_image/${shiftLogCommentID}`;
// const path = `shift_log_comments/upload_image?shift_id=${shiftData.shift_id}&shift_operator=${shiftData.shift_operator}&eb_id=${selectedLogDetails && selectedLogDetails.info && selectedLogDetails.info.eb_id ? selectedLogDetails.info.eb_id : ''}`;
// const path = `shift_log_comments/${commentItem.id}`;
// const path = `shift_log_comments/download_images/${commentId}`;
