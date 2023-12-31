import { environment } from "src/environments/environment";

export const MessageTypes = {
    error: "Error",
    info: "Info",
    failure: "Failure",
    success: "Success",
    warning: "Warning",
    question: "Question"
}

var baseUrl = environment.baseUrl;
var categoryUrl = baseUrl + 'Category/'
var courseContentUrl = baseUrl + 'courseContent/'
var authUrl = baseUrl + 'auth/'
var courseUrl = baseUrl + 'Course/'
var quizUrl = baseUrl + 'Quiz/'
var lectureUrl = baseUrl + 'lecture/'
var attachmentUrl = baseUrl + 'Attachment/';
var userUrl = baseUrl + 'User/';
var userReportsUrl = baseUrl + 'Reports/';
var EnrollmentUrl = baseUrl + 'Enrollment/';
var AssessmentUrl = baseUrl + 'assessment/';
var GradingCriteriaUrl = baseUrl + 'gradingCriteria/';
var DashboardUrl=baseUrl+'Dashboard';
export const APIPaths = {

    uploadAttachemnt: attachmentUrl + 'UploadFile',
    downloadAttachemnt: attachmentUrl + 'DownloadFile',
    deleteAttachemnt: attachmentUrl + 'DeleteFile',
    deleteCobrAttachment: attachmentUrl + 'DeleteCobrAttachment',
    deleteClurAttachment: attachmentUrl + 'DeleteClurAttachment',

    login: authUrl + 'login',
    //----------Dashboard URLs------------
    getDashboarddata:DashboardUrl+'/GetOverViewForAdminDashboard',

    //----------Category URLS--------------
    getAllCategories: categoryUrl + 'getAllByProc',
    addEditCategory: categoryUrl + 'addEditCategory',
    getCategoryById: categoryUrl + 'getCategoryById',
    getAllfiltercategories: categoryUrl + 'filterSearch',
    updateCategory: categoryUrl + 'ActiveInactive',
    //-----------Course URLS---------------
    getAllCourses: courseUrl + 'GetAllByProc',
    updateCourse: courseUrl + 'ActiveInactive',
    addEditCourse: courseUrl + 'addEditCourse',
    getCourseById: courseUrl + 'getCourseById',
    getAllCategoriesForCourses: courseUrl + 'getAllCategoriesForCourses',
    //-------------Lectures URL -------------
    getAllLectures: lectureUrl + 'GetAllByProc',
    addEditLectures: lectureUrl + 'AddEditLecture',
    getLectureById: lectureUrl + 'GetLectureById',
    updateLecture: lectureUrl + 'ActiveInactive',

    //-----------Course Content URLS--------------
    getAllCourseContent: courseContentUrl + 'getAllByProc',
    updateContent: courseContentUrl + 'activeInactive',
    getContentById: courseContentUrl + 'getCourseContentById',
    getAllCoursesDDL: courseContentUrl + 'getAllCoursesForTraining',
    getLecturesForSelectedCourse: courseContentUrl + 'GetLecturesForCourse',
    addEditContent: courseContentUrl + 'AddEditCourseContent',
    //------------Quiz URLS-----------------
    GetAllByProc: quizUrl + 'getAllByProc',
    updatestatus: quizUrl + 'activeInactive',
    getAllCoursesforquiz: quizUrl + 'getAllCourses',
    addEditQuiz: quizUrl + 'addEditQuestion',
    GetQuestionById: quizUrl + 'getQuestionById',
    getAllQuizDifficultyLevel: quizUrl + 'getAllQuizDifficultyLevel',
    getAllQuizType: quizUrl + 'getAllQuizType',
    GetLecturesAgainstCourse: quizUrl + 'getAllLectures',

    //--------------User URLS------------------//
    getAllUser: userUrl + 'GetAllByProc',
    addEditUser: userUrl + 'AddEdit',
    getUserById: userUrl + 'GetSingle',
    getUserDetailForCertificate: userUrl + 'getUserDetailForCertificate',
    updateUser: userUrl + 'ActiveInactive',
    //--------------UserReport URLS------------------//
    EnrollmentDetails: userReportsUrl + 'enrolledUserDetails',
    EnrolledCoursesCountReport: userReportsUrl + 'enrolledCoursesCountReport',
    GetAllUserGrades: userReportsUrl + 'GetAllUserGrades',
    getGradeCertificate: userReportsUrl + 'GetGradeById',
    updateEnrollmentDisableStatus: userReportsUrl + 'updateEnrollmentDisableStatus',
    //--------------Enrollment URLS------------------//
    getAllEnrollUsers: EnrollmentUrl + 'getAllByProc',
    addEditEnrollUser: EnrollmentUrl + 'addEditEnrollment',
    GetEnrollUserById: EnrollmentUrl + 'getById',
    getCourseByCategoryId: EnrollmentUrl + 'getCoursesByCategory',
    GetAllUsers: EnrollmentUrl + 'getAllUsers',
    fetchAllWaitingForApprovalUserList: EnrollmentUrl + 'getAllBywaitingForApprovalUserList',
    AgainRequestsForCourseApproval: EnrollmentUrl + 'GetAllAgainRequestsForCourseApproval',
    ApproveUserRequest: EnrollmentUrl + 'ApproveUserRequest',
    //--------------Assessment URLS------------------//
    getAllAssessment: AssessmentUrl + 'getAllByProc',
    updateassessment: AssessmentUrl + 'ActiveInactive',
    addEditAssessment: AssessmentUrl + 'addEditAssessment',
    GetAssessmnetById: AssessmentUrl + 'getAssessmentQuestionById',
    //--------------GradingCriteria URLS------------------//
    getAllGradingCriteria: GradingCriteriaUrl + 'getAllByProc',
    addEditGradingCriteria: GradingCriteriaUrl + 'addEditGradingCriteria',
    GetGradingCriteriaById: GradingCriteriaUrl + 'getGradingCriteriaById',
}
export const ResultMessages = {
    serverError: "Internal Server Error",
    loginError: "Please log in first",
    notExist: "Data not Exist",
    requiredAllField: "Please fill all feilds",
    permissionDenied: "You Don't have right to change",
    resendCode: "Code has been resent. Please check.",
    securityQuestionLimit: "Please answer at least 3 questions.",
    selectLeftItem: "You must first select an item on the left side.",
    selectRightItem: "You must first select an item on the right side.",
    atleastOneGroupOrRole: "Please select atleast one group/role.",
    replyByCallConfirmation: "Do you confirm you have talked to the customer?",
    closeEnquiryConfirmation: "Are you sure you want to close this Enquiry?",
    fileNotFound: "Sorry, we are unable to download this file for you.",
    ClosedEnquiry: "You can not close this enquiry, It is already closed.",
    selectDeleteItem: "Please select atleast one item.",
    fileSizeLimit: "Image size can not be more than 1 MB.",
    fileExtension: "File Format not supported",
    enquiryRepliedByCall: "Enquiry is replied by call.",
    enabledEOI: "Do you want to send Expression of Interest",
    allReadySubmitted: "Your Application is already inprogress, Our sale person will contact you soon",
    approveFAF: "Do you want to approve Franchise Application Form?",
    rejectFAF: "Do you want to Reject Franchise Application Form?",
    approveConcession: "Do you want to approve Concession Form?",
    rejectConcession: "Do you want to Reject fee Concession Form?",
    approveSurvey: "Do you want to approve Survey Form?",
    rejectSurvey: "Do you want to Reject Survey Form?",
    approveSalesApproval: "Do you want to approve Sales Approval Form?",
    rejectSalesApproval: "Do you want to Reject Sales Approval Form?",
    approveCOBR: "Do you want to approve COBR?",
    rejectCOBR: "Do you want to reject COBR?",
    approveCLUR: "Do you want to approve CLUR?",
    rejectCLUR: "Do you want to reject CLUR?",
    submitFormConfirmation: "Are you sure you want to submit your Form? After Submission you can not update your information",
    addLocation: "Please add atleast one Location.",
    addVicinity: "Please add atleast one school in vicinity and nearby Allied school.",
    approveMou: "Do you want to approve MOU Form?",
    rejectMou: "Do you want to cancel MOU Form?",
    wizardSecondSubmission: "Do you want to submit this form?",
    detailsAlreadyExist: "information Already Exist.",
    exempionValue: "Exemption amount is greater than total amount",
    confirmAdmission: "Do you want to Confirm the Admission Form?",
    confirmAdmissionEnquiry: "Do you want to Confirm the Admission Enquiry?",
    confirmPushNotification: "you want to send this notification?",
    confirmChallan: "Do you want to Confirm the Challan?",
    markAttendance: "Attendence has been marked",
    markAllAttendance: "Please mark all student",
    removeUserInfo: "By Continue, Your fill data will be reset",
    wrongFile: "Please Upload a Valid Admission Template file",
    successfullyadd: "Add Successfully",
    successfullyUpdate: "Update Successfully"


}