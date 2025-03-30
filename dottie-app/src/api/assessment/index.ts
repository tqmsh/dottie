import getList from "./getList";
import getById from "./getById";
import postSend from "./postSend";
import putUpdate from "./putUpdate";
import deleteAssessment from "./delete";

// Export types
export * from "./types";

// Export individual endpoints
export {
  getList,
  getById,
  postSend as sendAssessment,
  putUpdate as update,
  deleteAssessment
};

// Assessment API object for backward compatibility
export const assessmentApi = {
  list: getList,
  getById,
  sendAssessment: postSend,
  update: putUpdate,
  delete: deleteAssessment
};

export default assessmentApi; 